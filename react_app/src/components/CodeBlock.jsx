import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import useStore from '../node/store';
// import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const themeColors = [
    "#FFE867", "#FFC8C8", "#FF8B67"
  ]

const CodeBlock = ({ inline, className, children }) => {
    const{ themeColorId } = useStore( state => ({ themeColorId: state.themeColorId }));

    if (inline) {
    return <code className={className}>{children}</code>;
    }
    const match = /language-(\w+)/.exec(className || '');
    const lang = match && match[1] ? match[1] : '';
    return (
    <SyntaxHighlighter
        style={{
        "code[class*=\"language-\"]": {
            "color": "#f8f8f2",
            "background": "none",
            "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
            "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            "textAlign": "left",
            "whiteSpace": "pre",
            "wordSpacing": "normal",
            "wordBreak": "normal",
            "wordWrap": "normal",
            "lineHeight": "1.5",
            "MozTabSize": "4",
            "OTabSize": "4",
            "tabSize": "4",
            "WebkitHyphens": "none",
            "MozHyphens": "none",
            "msHyphens": "none",
            "hyphens": "none"
        },
        "pre[class*=\"language-\"]": {
            "color": "#f8f8f2",
            "background": "#191919",
            "textShadow": "0 1px rgba(0, 0, 0, 0.3)",
            "fontFamily": "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            "textAlign": "left",
            "whiteSpace": "pre",
            "wordSpacing": "normal",
            "wordBreak": "normal",
            "wordWrap": "normal",
            "lineHeight": "1.5",
            "MozTabSize": "4",
            "OTabSize": "4",
            "tabSize": "4",
            "WebkitHyphens": "none",
            "MozHyphens": "none",
            "msHyphens": "none",
            "hyphens": "none",
            "padding": "1em",
            "margin": ".5em 0",
            "overflow": "auto",
            "borderRadius": "0.3em"
        },
        ":not(pre) > code[class*=\"language-\"]": {
            "background": "#282a36",
            "padding": ".1em",
            "borderRadius": ".3em",
            "whiteSpace": "normal"
        },
        "comment": {
            "color": "#6272a4"
        },
        "prolog": {
            "color": "#6272a4"
        },
        "doctype": {
            "color": "#6272a4"
        },
        "cdata": {
            "color": "#6272a4"
        },
        "punctuation": {
            "color": "#f8f8f2"
        },
        ".namespace": {
            "Opacity": ".7"
        },
        "property": {
            "color": "#ff79c6"
        },
        "tag": {
            "color": "#ff79c6"
        },
        "constant": {
            "color": "#ff79c6"
        },
        "symbol": {
            "color": "#ff79c6"
        },
        "deleted": {
            "color": "#ff79c6"
        },
        "boolean": {
            "color": "#bd93f9"
        },
        "number": {
            "color": "#bd93f9"
        },
        "selector": {
            "color": "#7BC74D"
        },
        "attr-name": {
            "color": "#7BC74D"
        },
        "string": {
            "color": "#7BC74D"
        },
        "char": {
            "color": "#7BC74D"
        },
        "builtin": {
            "color": "#7BC74D"
        },
        "inserted": {
            "color": "#7BC74D"
        },
        "operator": {
            "color": "#f8f8f2"
        },
        "entity": {
            "color": "#f8f8f2",
            "cursor": "help"
        },
        "url": {
            "color": "#f8f8f2"
        },
        ".language-css .token.string": {
            "color": "#f8f8f2"
        },
        ".style .token.string": {
            "color": "#f8f8f2"
        },
        "variable": {
            "color": "#f8f8f2"
        },
        "atrule": {
            "color": "#f1fa8c"
        },
        "attr-value": {
            "color": "#f1fa8c"
        },
        "function": {
            "color": "#f1fa8c"
        },
        "class-name": {
            "color": "#f1fa8c"
        },
        "keyword": {
            "color": `${themeColors[themeColorId]}`
        },
        "regex": {
            "color": "#ffb86c"
        },
        "important": {
            "color": "#ffb86c",
            "fontWeight": "bold"
        },
        "bold": {
            "fontWeight": "bold"
        },
        "italic": {
            "fontStyle": "italic"
        }
    }}
        language={lang}
        children={String(children).replace(/\n$/, '')}
    />
    );
};

export default CodeBlock;