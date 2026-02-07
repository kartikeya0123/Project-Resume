import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  action: 'optimize_resume' | 'generate_career_recommendations' | 'analyze_skills' | 'create_roadmap';
  data: any;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { action, data }: RequestBody = await req.json();

    let result;

    switch (action) {
      case 'optimize_resume':
        result = await optimizeResume(data);
        break;
      case 'generate_career_recommendations':
        result = await generateCareerRecommendations(data);
        break;
      case 'analyze_skills':
        result = await analyzeSkills(data);
        break;
      case 'create_roadmap':
        result = await createRoadmap(data);
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

async function optimizeResume(resumeData: any) {
  return {
    optimized: true,
    atsScore: 85,
    suggestions: [
      'Add more action verbs to your experience descriptions',
      'Include quantifiable achievements with specific metrics',
      'Tailor your summary to match the target job description',
      'Add relevant keywords for ATS optimization',
    ],
  };
}

async function generateCareerRecommendations(userData: any) {
  return {
    recommendations: [
      {
        role: 'Full Stack Developer',
        matchScore: 92,
        reasoning: 'Strong match based on your technical skills and experience',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
        salaryRange: '$80,000 - $130,000',
      },
    ],
  };
}

async function analyzeSkills(userData: any) {
  return {
    gaps: [
      {
        skill: 'System Design',
        importance: 'high',
        currentLevel: 'beginner',
        targetLevel: 'advanced',
      },
    ],
  };
}

async function createRoadmap(userData: any) {
  return {
    roadmap: {
      title: 'Career Development Path',
      steps: [
        {
          title: 'Master Core Technologies',
          duration: '3 months',
          resources: [],
        },
      ],
    },
  };
}
