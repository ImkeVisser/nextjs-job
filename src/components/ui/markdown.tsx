import ReactMarkDown from "react-markdown"

interface MarkdownProps {
    children: string;
}

export default function Markdown({children}: MarkdownProps){
    return <ReactMarkDown
                className="space-y-3"
                components={{
                    ul: (props) => <ul className="list-inside list-disc" {...props} />,
                    a: (props) => <a className="text-green-500 hover:underline" target="_blank"{...props}/>
                }}
    >{children}</ReactMarkDown>
}