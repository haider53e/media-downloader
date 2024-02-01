export default function ({ item }) {
  return (
    <audio
      style={{
        width: "300px",
        minWidth: "300px",
        borderRadius: "6px",
      }}
      controls
      controlsList="nodownload"
      onPlay={({ target }) =>
        Array.from(document.querySelectorAll("audio,video")).forEach(
          (media) => media !== target && media.pause()
        )
      }
    >
      <source src={item.url} />
    </audio>
  );
}
