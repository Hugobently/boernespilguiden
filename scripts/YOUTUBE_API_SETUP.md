# YouTube API Setup Guide

To enable automatic video search for games, you need to set up a YouTube Data API v3 key.

## Step-by-Step Setup

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create or Select a Project
- Click the project dropdown at the top
- Click "New Project"
- Name it (e.g., "Boernespilguiden")
- Click "Create"

### 3. Enable YouTube Data API v3
- In the search bar, type "YouTube Data API v3"
- Click on "YouTube Data API v3"
- Click "Enable"

### 4. Create API Key
- Go to "Credentials" (left sidebar)
- Click "Create Credentials"
- Select "API Key"
- Copy the generated API key

### 5. (Optional) Restrict API Key
For better security:
- Click on your API key to edit it
- Under "API restrictions", select "Restrict key"
- Select "YouTube Data API v3"
- Save

### 6. Add to .env File
Open `.env` file and add:
```
YOUTUBE_API_KEY=your_api_key_here
```

## Free Tier Limits

- **Daily Quota**: 10,000 units per day
- **Search Cost**: 100 units per search
- **Effective Limit**: ~100 searches per day

For 123 games, this is more than sufficient (you can fetch all videos in one run).

## Testing

Test if the API key works:
```bash
npm run fetch:media
```

The script will indicate if the YouTube API is configured correctly.

## Troubleshooting

### Error: "The request cannot be completed because you have exceeded your quota"
- You've hit the daily limit
- Wait 24 hours or create a new project with a new API key

### Error: "API key not valid"
- Check that you copied the entire key
- Make sure YouTube Data API v3 is enabled
- Check API restrictions (if set)

### No YouTube results found
- This is normal for some games
- The script will continue and mark them for manual review
