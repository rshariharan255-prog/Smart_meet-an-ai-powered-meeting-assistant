from moviepy import VideoFileClip
import os
from config import OUTPUT_DIR

def extract_audio(video_path: str):
    filename = os.path.basename(video_path)
    audio_path = os.path.join(OUTPUT_DIR, filename + ".mp3")

    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path)

    return audio_path