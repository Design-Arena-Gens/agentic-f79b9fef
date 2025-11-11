import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { imageUrl, caption } = await request.json()

    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const userId = process.env.INSTAGRAM_USER_ID

    if (!accessToken || !userId) {
      return NextResponse.json(
        { error: 'Instagram credentials not configured. Please set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in .env file.' },
        { status: 400 }
      )
    }

    // Step 1: Create media container
    const containerResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${userId}/media`,
      {
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken,
      }
    )

    const containerId = containerResponse.data.id

    // Step 2: Publish the container
    const publishResponse = await axios.post(
      `https://graph.facebook.com/v18.0/${userId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      }
    )

    return NextResponse.json({
      success: true,
      postId: publishResponse.data.id,
    })
  } catch (error: any) {
    console.error('Error uploading to Instagram:', error.response?.data || error)

    let errorMessage = 'Failed to upload to Instagram'
    if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
