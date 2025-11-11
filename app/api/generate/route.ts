import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: Request) {
  try {
    const { prompt, style, gender, pose } = await request.json()

    // Build the artistic prompt
    let fullPrompt = 'A beautiful artistic drawing of a human, '

    // Add gender
    if (gender === 'male') {
      fullPrompt += 'male person, '
    } else if (gender === 'female') {
      fullPrompt += 'female person, '
    } else {
      fullPrompt += 'person, '
    }

    // Add pose
    const poseDescriptions: { [key: string]: string } = {
      'portrait': 'head and shoulders portrait',
      'full-body': 'full body standing pose',
      'sitting': 'sitting pose',
      'standing': 'standing confidently',
      'walking': 'walking gracefully',
      'dancing': 'dancing elegantly',
    }
    fullPrompt += poseDescriptions[pose] || 'portrait pose'
    fullPrompt += ', '

    // Add style
    const styleDescriptions: { [key: string]: string } = {
      'realistic': 'photorealistic style, highly detailed, professional photography',
      'watercolor': 'watercolor painting style, soft colors, artistic brush strokes',
      'oil-painting': 'oil painting style, rich colors, classical art technique',
      'sketch': 'pencil sketch style, detailed shading, artistic drawing',
      'anime': 'anime art style, vibrant colors, manga aesthetic',
      'portrait': 'classical portrait painting style, Renaissance technique',
      'abstract': 'modern abstract art style, bold colors, contemporary aesthetic',
      'impressionist': 'impressionist painting style, soft light, artistic interpretation',
    }
    fullPrompt += styleDescriptions[style] || 'artistic style'

    // Add user prompt if provided
    if (prompt && prompt.trim()) {
      fullPrompt += ', ' + prompt.trim()
    }

    // Add quality enhancers
    fullPrompt += ', masterpiece, high quality, professional artwork, 8k resolution'

    console.log('Generating image with prompt:', fullPrompt)

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI')
    }

    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    console.error('Error generating image:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    )
  }
}
