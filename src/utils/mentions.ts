const MENTION_PATTERN = /(^|\s)@([\w.-]*\w)/g;

type MentionTarget = { _id: string; username: string };

function splitMentions<T extends MentionTarget>(text: string, people: T[]) {
  const parts: Array<{ text: string; user?: T }> = [];
  let cursor = 0;

  for (const match of text.matchAll(MENTION_PATTERN)) {
    const user = people.find(
      (person) => person.username.toLowerCase() === match[2].toLowerCase(),
    );
    if (!user) continue;

    const start = (match.index ?? 0) + match[1].length;
    if (start > cursor) parts.push({ text: text.slice(cursor, start) });

    parts.push({ text: `@${match[2]}`, user });
    cursor = start + match[2].length + 1;
  }

  if (cursor < text.length) parts.push({ text: text.slice(cursor) });

  return parts;
}

function getMentionedIds(text: string, people: MentionTarget[]) {
  const ids = splitMentions(text, people).flatMap((part) =>
    part.user ? [part.user._id] : [],
  );

  return [...new Set(ids)];
}

export { getMentionedIds, splitMentions };
