interface LogEntry {
  level: 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  message: string;
  timestamp: string;
}

export async function* streamLogs(url: string): AsyncGenerator<LogEntry> {
  const response = await fetch(url);
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // Decode the chunk and add it to our running buffer
    buffer += decoder.decode(value, { stream: true });

    // Split on newlines — one chunk may contain MULTIPLE lines
    const lines = buffer.split('\n');

    // The last element may be an incomplete line, keep it in the buffer
    buffer = lines.pop()!;

    for (const line of lines) {
      if (line.trim()) {
        yield JSON.parse(line) as LogEntry;
      }
    }
  }

  // Flush any remaining content in the buffer
  if (buffer.trim()) {
    yield JSON.parse(buffer) as LogEntry;
  }
}
