import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const interests = searchParams.get('interests') || 'general';

    // Mock dynamic response based on interests
    const insights = [
        {
            id: "vid1",
            type: "video",
            title: `Advanced ${interests}: The 2026 Masterclass`,
            thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
            link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            source: "TechPulse YT"
        },
        {
            id: "vid2",
            type: "video",
            title: `Building Scalable Apps with ${interests}`,
            thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
            link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            source: "Code Academy"
        },
        {
            id: "vid3",
            type: "video",
            title: `Why ${interests} is the Future of Engineering`,
            thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
            link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            source: "Dev Weekly"
        },
        {
            id: "news1",
            type: "news",
            title: `How ${interests} is shaping the industry this year`,
            thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
            link: "#",
            source: "DevDaily"
        },
        {
            id: "news2",
            type: "news",
            title: `Top 5 ${interests} tools every developer needs mapped out`,
            thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=600&auto=format&fit=crop",
            link: "#",
            source: "CodeWeekly"
        },
        {
            id: "news3",
            type: "news",
            title: `The ultimate guide to transitioning into a ${interests} role`,
            thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
            link: "#",
            source: "TechCrunch"
        },
        {
            id: "news4",
            type: "news",
            title: `Should you adapt ${interests} in your enterprise stack?`,
            thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
            link: "#",
            source: "Forbes Tech"
        },
        {
            id: "news5",
            type: "news",
            title: `${interests} vs Traditional Architectures: A deep dive`,
            thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
            link: "#",
            source: "Wired"
        },
        {
            id: "news6",
            type: "news",
            title: `Open Source contributions surrounding ${interests} double in 2026`,
            thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop",
            link: "#",
            source: "GitHub Blog"
        },
    ];

    // Simulate Network/API latency
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json(insights);
}
