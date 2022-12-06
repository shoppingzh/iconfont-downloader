export function parseAttrs(content: string): Record<string, string> {
  const re = new RegExp(/(\w+)\s*=\s*['"](.*?)['"]/, 'g')
  let result: RegExpExecArray | null
  const attrs: Record<string, string> = {}
  // eslint-disable-next-line no-cond-assign
  while (result = re.exec(content)) {
    attrs[result[1]] = result[2]
  }
  return attrs
}
