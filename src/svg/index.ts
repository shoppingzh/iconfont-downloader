interface ParseResult {
  id?: string
  svg?: string
}

function parseAttrs(content: string): Record<string, string> {
  const re = new RegExp(/(\w+)\s*=\s*['"](.*?)['"]/, 'g')
  let result: RegExpExecArray | null
  const attrs: Record<string, string> = {}
  // eslint-disable-next-line no-cond-assign
  while (result = re.exec(content)) {
    attrs[result[1]] = result[2]
  }
  return attrs
}

/**
 * 将一个大svg的symbol解析为多个svg
 * 
 * @param content 
 * @returns 
 */
export function parse(content: string): ParseResult[] {
  const re = new RegExp(/<symbol\s*(.*?)\s*>(.*?)(?:<\/symbol>)/, 'g')
  let result: RegExpExecArray | null
  const list: ParseResult[] = []
  // eslint-disable-next-line no-cond-assign
  while (result = re.exec(content)) {
    const classname = result[1]
    const inner = result[2]
    const attrs = parseAttrs(classname)
    list.push({
      id: attrs.id,
      svg: `<svg width="150" height="150" ${classname}>${inner}</svg>`,
    })
  }

  return list
}
