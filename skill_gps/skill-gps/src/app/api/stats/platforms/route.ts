import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const github = searchParams.get("github");
    const leetcode = searchParams.get("leetcode");

    if (!github && !leetcode) {
        return NextResponse.json({ error: "Missing platform usernames" }, { status: 400 });
    }

    const results: any = { github: null, leetcode: null };

    // --- GitHub Integration ---
    if (github) {
        try {
            const [profileRes, eventsRes] = await Promise.all([
                fetch(`https://api.github.com/users/${github}`),
                fetch(`https://api.github.com/users/${github}/events/public?per_page=5`)
            ]);
            
            if (profileRes.ok) {
                const profile = await profileRes.json();
                results.github = {
                    username: profile.login,
                    avatar: profile.avatar_url,
                    publicRepos: profile.public_repos,
                    followers: profile.followers,
                    bio: profile.bio,
                    streak: 0, // GitHub doesn't expose streak via public REST easily
                };
            }
            
            if (eventsRes.ok) {
                const events = await eventsRes.json();
                const recentEvents = events.map((ev: any) => ({
                    type: ev.type,
                    repo: ev.repo.name,
                    date: ev.created_at,
                    msg: ev.payload?.commits?.[0]?.message || ""
                }));
                results.github.recentEvents = recentEvents;

                // Calculate a basic streak (days of activity in a row)
                if (recentEvents.length > 0) {
                    const uniqueDays = new Set(recentEvents.map((e: any) => new Date(e.date).toDateString()));
                    let streak = 0;
                    let checkDate = new Date();
                    while (uniqueDays.has(checkDate.toDateString())) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    }
                    results.github.streak = streak;
                }
            }
        } catch (e) {
            console.error("GitHub Fetch Error:", e);
        }
    }

    // --- LeetCode Integration (GraphQL) ---
    if (leetcode) {
        try {
            const query = `
                query getUserProfile($username: String!) {
                    matchedUser(username: $username) {
                        username
                        submitStats: submitStatsGlobal {
                            acSubmissionNum {
                                difficulty
                                count
                                submissions
                            }
                        }
                        profile {
                            ranking
                            userAvatar
                        }
                    }
                    userCalendar(username: $username) {
                        streak
                        totalActiveDays
                    }
                }
            `;
            
            const lcRes = await fetch("https://leetcode.com/graphql/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, variables: { username: leetcode } }),
            });

            if (lcRes.ok) {
                const { data } = await lcRes.json();
                if (data.matchedUser) {
                    const stats = data.matchedUser.submitStats.acSubmissionNum;
                    results.leetcode = {
                        username: data.matchedUser.username,
                        ranking: data.matchedUser.profile.ranking,
                        totalSolved: stats[0].count,
                        easySolved: stats[1].count,
                        mediumSolved: stats[2].count,
                        hardSolved: stats[3].count,
                        streak: data.userCalendar?.streak || 0,
                        activeDays: data.userCalendar?.totalActiveDays || 0
                    };
                }
            }
        } catch (e) {
            console.error("LeetCode Fetch Error:", e);
        }
    }

    return NextResponse.json(results);
}
