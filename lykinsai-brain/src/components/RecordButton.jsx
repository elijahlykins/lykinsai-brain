function RecordButton({ isRecording, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full w-24 h-24 flex items-center justify-center text-white text-lg font-semibold
        ${isRecording ? "bg-red-600" : "bg-blue-600"} 
        hover:scale-105 transition-transform`}
    >
      {isRecording ? "Stop" : "Record"}
    </button>
  );
}
export default RecordButton;
