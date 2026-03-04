import { describe, it, expect, vi, beforeEach } from 'vitest';
import { streamLogs } from './09-stream-logs';

function mockStream(): ReadableStream {
  const logs = [
    {
      level: 'INFO',
      message: 'Server started',
      timestamp: '2026-03-04T10:00:00Z',
    },
    {
      level: 'WARN',
      message: 'High memory usage',
      timestamp: '2026-03-04T10:00:01Z',
    },
    {
      level: 'FATAL',
      message: 'Out of memory',
      timestamp: '2026-03-04T10:00:02Z',
    },
  ];

  return new ReadableStream({
    async start(controller) {
      for (const log of logs) {
        await new Promise((r) => setTimeout(r, 500)); // simulate delay
        controller.enqueue(
          new TextEncoder().encode(JSON.stringify(log) + '\n'),
        );
      }
      controller.close();
    },
  });
}

function mockStreamFromChunks(chunks: string[]): ReadableStream {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
      }
      controller.close();
    },
  });
}

function mockFetch(stream: ReadableStream) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ body: stream }));
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('streamLogs', () => {
  it('yields all log entries from the stream in order', async () => {
    mockFetch(mockStream());

    const results = [];
    for await (const log of streamLogs('http://fake-url')) {
      results.push(log);
    }

    expect(results).toEqual([
      {
        level: 'INFO',
        message: 'Server started',
        timestamp: '2026-03-04T10:00:00Z',
      },
      {
        level: 'WARN',
        message: 'High memory usage',
        timestamp: '2026-03-04T10:00:01Z',
      },
      {
        level: 'FATAL',
        message: 'Out of memory',
        timestamp: '2026-03-04T10:00:02Z',
      },
    ]);
  });

  it('yields correct number of entries', async () => {
    mockFetch(mockStream());

    const results = [];
    for await (const log of streamLogs('http://fake-url')) {
      results.push(log);
    }

    expect(results).toHaveLength(3);
  });

  it('handles multiple JSON objects in a single chunk', async () => {
    const log1 = {
      level: 'INFO',
      message: 'first',
      timestamp: '2026-03-04T10:00:00Z',
    };
    const log2 = {
      level: 'ERROR',
      message: 'second',
      timestamp: '2026-03-04T10:00:01Z',
    };
    const combined = JSON.stringify(log1) + '\n' + JSON.stringify(log2) + '\n';

    mockFetch(mockStreamFromChunks([combined]));

    const results = [];
    for await (const log of streamLogs('http://fake-url')) {
      results.push(log);
    }

    expect(results).toEqual([log1, log2]);
  });

  it('handles a JSON object split across multiple chunks', async () => {
    const log = {
      level: 'INFO',
      message: 'split',
      timestamp: '2026-03-04T10:00:00Z',
    };
    const json = JSON.stringify(log) + '\n';
    const mid = Math.floor(json.length / 2);
    const chunks = [json.slice(0, mid), json.slice(mid)];

    mockFetch(mockStreamFromChunks(chunks));

    const results = [];
    for await (const log of streamLogs('http://fake-url')) {
      results.push(log);
    }

    expect(results).toEqual([log]);
  });

  it('returns an empty result for an empty stream', async () => {
    mockFetch(mockStreamFromChunks([]));

    const results = [];
    for await (const log of streamLogs('http://fake-url')) {
      results.push(log);
    }

    expect(results).toHaveLength(0);
  });

  it('skips blank lines in the stream', async () => {
    const log = {
      level: 'WARN',
      message: 'only one',
      timestamp: '2026-03-04T10:00:00Z',
    };
    const chunk = '\n\n' + JSON.stringify(log) + '\n\n';

    mockFetch(mockStreamFromChunks([chunk]));

    const results = [];
    for await (const log of streamLogs('http://fake-url')) {
      results.push(log);
    }

    expect(results).toEqual([log]);
  });

  it('yields entries with correct field types', async () => {
    mockFetch(mockStream());

    for await (const log of streamLogs('http://fake-url')) {
      expect(log).toHaveProperty('level');
      expect(log).toHaveProperty('message');
      expect(log).toHaveProperty('timestamp');
      expect(typeof log.level).toBe('string');
      expect(typeof log.message).toBe('string');
      expect(typeof log.timestamp).toBe('string');
    }
  });

  it('calls fetch with the provided URL', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ body: mockStreamFromChunks([]) });
    vi.stubGlobal('fetch', fetchMock);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _ of streamLogs('http://logs.example.com/stream')) {
      // drain
    }

    expect(fetchMock).toHaveBeenCalledWith('http://logs.example.com/stream');
  });
});
