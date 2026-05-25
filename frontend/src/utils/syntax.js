// Lightweight Python syntax highlighter
const KEYWORDS = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g
const BUILTINS = /\b(abs|all|any|bin|bool|breakpoint|bytearray|bytes|callable|chr|classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|isinstance|issubclass|iter|len|list|locals|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip)\b/g
const STRINGS_DQ = /"([^"\\]|\\.)*"/g
const STRINGS_SQ = /'([^'\\]|\\.)*'/g
const STRINGS_FSTR = /f"([^"\\]|\\.)*"/g
const NUMBERS = /\b\d+(\.\d+)?\b/g
const COMMENTS = /#.*/g

export function highlightPython(line) {
  if (!line) return '<span class="token-plain"> </span>'

  // Escape HTML first
  let escaped = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // We'll build tokens by scanning left-to-right
  const tokens = []
  let i = 0
  const src = line

  while (i < src.length) {
    // Comment
    if (src[i] === '#') {
      tokens.push({ type: 'comment', value: src.slice(i) })
      i = src.length
      continue
    }
    // f-string
    if (src[i] === 'f' && (src[i+1] === '"' || src[i+1] === "'")) {
      const q = src[i+1]
      let j = i + 2
      while (j < src.length && src[j] !== q) {
        if (src[j] === '\\') j++
        j++
      }
      tokens.push({ type: 'string', value: src.slice(i, j + 1) })
      i = j + 1
      continue
    }
    // String
    if (src[i] === '"' || src[i] === "'") {
      const q = src[i]
      let j = i + 1
      while (j < src.length && src[j] !== q) {
        if (src[j] === '\\') j++
        j++
      }
      tokens.push({ type: 'string', value: src.slice(i, j + 1) })
      i = j + 1
      continue
    }
    // Word (keyword, builtin, boolean, or plain)
    if (/[a-zA-Z_]/.test(src[i])) {
      let j = i
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j])) j++
      const word = src.slice(i, j)
      const kwList = ['False','None','True','and','as','assert','async','await','break','class',
        'continue','def','del','elif','else','except','finally','for','from','global','if',
        'import','in','is','lambda','nonlocal','not','or','pass','raise','return','try',
        'while','with','yield']
      const builtinList = ['abs','all','any','bin','bool','breakpoint','bytearray','bytes',
        'callable','chr','classmethod','compile','complex','delattr','dict','dir','divmod',
        'enumerate','eval','exec','filter','float','format','frozenset','getattr','globals',
        'hasattr','hash','help','hex','id','input','int','isinstance','issubclass','iter',
        'len','list','locals','map','max','memoryview','min','next','object','oct','open',
        'ord','pow','print','property','range','repr','reversed','round','set','setattr',
        'slice','sorted','staticmethod','str','sum','super','tuple','type','vars','zip']
      let type = 'plain'
      if (kwList.includes(word)) type = 'keyword'
      else if (builtinList.includes(word)) type = 'builtin'
      tokens.push({ type, value: word })
      i = j
      continue
    }
    // Number
    if (/[0-9]/.test(src[i])) {
      let j = i
      while (j < src.length && /[0-9.]/.test(src[j])) j++
      tokens.push({ type: 'number', value: src.slice(i, j) })
      i = j
      continue
    }
    // Operator / punctuation / whitespace
    tokens.push({ type: 'plain', value: src[i] })
    i++
  }

  return tokens.map(t => {
    const v = t.value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<span class="token-${t.type}">${v}</span>`
  }).join('')
}
