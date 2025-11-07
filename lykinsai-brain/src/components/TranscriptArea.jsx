function TranscriptArea({ text }) {
  return (
    <div className="flex-grow flex items-center justify-center text-gray-100 p-8 text-lg">
      <p>{text || "Your live transcription will appear here..."}</p>
    </div>
  );
}
export default TranscriptArea;
