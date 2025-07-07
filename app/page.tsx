"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X, ExternalLink, BookOpen, FileText, ZoomIn, ZoomOut, Maximize2, Code, Github, Download } from "lucide-react"
import mermaid from "mermaid"
import 'katex/dist/katex.min.css'
import { InlineMath } from 'react-katex'

interface Paper {
  title: string
  authors: string[]
  year: number
  url: string
}

interface Encoding {
  label: string
  url: string
}

interface Node {
  id: string
  label: string
  fullName: string
  shortLabel: string
  definition: string
  papers: Paper[]
  encodings: Encoding[] | null
}

interface Edge {
  source: string
  target: string
  style?: "solid" | "dashed"
}

const argumentationNodes: Node[] = [
  {
    id: "conflict-free",
    label: "Conflict-free (Cf)",
    fullName: "Conflict-free",
    shortLabel: "Cf",
    definition: "A set $S$ of arguments is said to be conflict-free if there are no arguments $A$ and $B$ in $S$ such that $A$ attacks $B$.",
    papers: [
      {
        title: "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
        authors: ["Dung, P. M."],
        year: 1995,
        url: "https://www.sciencedirect.com/science/article/pii/000437029400041X"
      }
    ],
    encodings: null
  },
  {
    id: "admissible",
    label: "Admissible (Adm)",
    fullName: "Admissible",
    shortLabel: "Adm",
    definition: "(1) An argument $A \\in AR$ is acceptable with respect to a set $S$ of arguments iff for each argument $B \\in AR$: if $B$ attacks $A$ then $B$ is attacked by $S$. (2) A conflict-free set of arguments $S$ is admissible iff each argument in $S$ is acceptable with respect to $S$.",
    papers: [
      {
        title: "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
        authors: ["Dung, P. M."],
        year: 1995,
        url: "https://www.sciencedirect.com/science/article/pii/000437029400041X"
      }
    ],
    encodings: [
      { label: "DLV & Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/adm.dl" }
    ]
  },
  {
    id: "complete",
    label: "Complete (Cmp)",
    fullName: "Complete",
    shortLabel: "Cmp",
    definition: "An admissible set $S$ of arguments is called a complete extension iff each argument, which is acceptable with respect to $S$, belongs to $S$.",
    papers: [
      {
        title: "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
        authors: ["Dung, P. M."],
        year: 1995,
        url: "https://www.sciencedirect.com/science/article/pii/000437029400041X"
      }
    ],
    encodings: [
      { label: "DLV & Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/comp.dl" }
    ]
  },
  {
    id: "grounded",
    label: "Grounded (Grd)",
    fullName: "Grounded",
    shortLabel: "Grd",
    definition: "The grounded extension of an argumentation framework $AF$, denoted by $GE_{AF}$, is the least fixed point of $F_{AF}$.",
    papers: [
      {
        title: "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
        authors: ["Dung, P. M."],
        year: 1995,
        url: "https://www.sciencedirect.com/science/article/pii/000437029400041X"
      }
    ],
    encodings: [
      { label: "DLV & Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/ground.dl" }
    ]
  },
  {
    id: "preferred",
    label: "Preferred (Prf)",
    fullName: "Preferred",
    shortLabel: "Prf",
    definition: "A preferred extension of an argumentation framework $AF$ is a maximal (with respect to set inclusion) admissible set of $AF$.",
    papers: [
      {
        title: "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
        authors: ["Dung, P. M."],
        year: 1995,
        url: "https://www.sciencedirect.com/science/article/pii/000437029400041X"
      }
    ],
    encodings: [
      { label: "DLV", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/prefexDLV.dl" },
      { label: "Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/prefex_gringo.lp" }
    ]
  },
  {
    id: "semi-stable",
    label: "Semi-Stable (Sstb)",
    fullName: "Semi-Stable",
    shortLabel: "Sstb",
    definition: "Let $(Ar,\\, att)$ be an argumentation framework and $Args \\subseteq Ar$. $Args$ is called a semi-stable extension iff $Args$ is a complete extension where $Args \\cup Args^+$ is maximal.",
    papers: [
      {
        title: "Semi-stable semantics",
        authors: ["Caminada, M."],
        year: 2006,
        url: "https://mysite.cs.cf.ac.uk/CaminadaM/publications/COMMA_semi-stable.pdf"
      }
    ],
    encodings: [
      { label: "Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/semi_stable_gringo.lp" }
    ]
  },
  {
    id: "ideal",
    label: "Ideal (Idl)",
    fullName: "Ideal",
    shortLabel: "Idl",
    definition: "A set $X$ of arguments is ideal iff $X$ is admissible and it is contained in every preferred set of arguments.",
    papers: [
      {
        title: "Computing ideal sceptical argumentation",
        authors: ["Dung, P. M.", "Mancarella, P.", "Toni, F."],
        year: 2007,
        url: "https://www.sciencedirect.com/science/article/pii/S000437020700080X"
      }
    ],
    encodings: [
      { label: "DLV", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/ideal.dl" }
    ]
  },
  {
    id: "strongly-admissible",
    label: "Strongly Admissible (Str)",
    fullName: "Strongly Admissible",
    shortLabel: "Str",
    definition: "Let $(Ar, att)$ be an argumentation framework. $Args \\subseteq Ar$ is strongly admissible iff every $A \\in Args$ is defended by some $Args' \\subseteq Args \\setminus \\{A\\}$ which in its turn is again strongly admissible.",
    papers: [
      {
        title: "Strong admissibility revisited",
        authors: ["Caminada, M."],
        year: 2014,
        url: "https://users.cs.cf.ac.uk/CaminadaM/publications/StrAdmCOMMA14.pdf"
      }
    ],
    encodings: [
      { label: "Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/str_adm.lp" }
    ]
  },
  {
    id: "eager",
    label: "Eager (Egr)",
    fullName: "Eager",
    shortLabel: "Egr",
    definition: "The eager extension is the greatest (w.r.t. set-inclusion) admissible set that is a subset of each semi-stable extension.",
    papers: [
      {
        title: "Comparing two unique extension semantics for formal argumentation: ideal and eager",
        authors: ["Caminada, M."],
        year: 2007,
        url: "https://users.cs.cf.ac.uk/CaminadaM/publications/ideal-eager.pdf"
      }
    ],
    encodings: null
  },
  {
    id: "naive",
    label: "Naive (Nav)",
    fullName: "Naive",
    shortLabel: "Nav",
    definition: "The simplest notion of acceptability, which in its credulous manifestation we call the naive semantics, requires simply that the initial theory be extended with some maximal set of assumptions which is conflict-free.",
    papers: [
      {
        title: "An abstract, argumentation-theoretic approach to default reasoning",
        authors: ["Bondarenko, A.", "Dung, P. M.", "Kowalski, R. A.", "Toni, F."],
        year: 1997,
        url: "https://www.sciencedirect.com/science/article/pii/S0004370297000155"
      }
    ],
    encodings: [
      { label: "DLV & Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/naive.dl" }
    ]
  },
  {
    id: "stable",
    label: "Stable (Stb)",
    fullName: "Stable",
    shortLabel: "Stb",
    definition: "A conflict-free set of arguments $S$ is called a stable extension iff $S$ attacks each argument which does not belong to $S$.",
    papers: [
      {
        title: "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
        authors: ["Dung, P. M."],
        year: 1995,
        url: "https://www.sciencedirect.com/science/article/pii/000437029400041X"
      }
    ],
    encodings: [
      { label: "DLV & Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/stable.dl" }
    ]
  },
  {
    id: "stage",
    label: "Stage (Stg)",
    fullName: "Stage",
    shortLabel: "Stg",
    definition: "Let $AF = (A, R)$ be an AF. A set $S$ is a stage (resp. a semi-stable) extension of $AF$, if $S$ is maximal conflict-free (resp. admissible) in $AF$.",
    papers: [
      {
        title: "Two approaches to dialectical argumentation: admissible sets and argumentation stages",
        authors: ["Verheij, B."],
        year: 1996,
        url: "https://www.ai.rug.nl/~verheij/publications/pdf/cd96.pdf"
      },
      {
        title: "Complexity of semi-stable and stage semantics in argumentation frameworks",
        authors: ["Dvořák, W.", "Woltran, S."],
        year: 2010,
        url: "https://www.sciencedirect.com/science/article/pii/S0020019010000864"
      }
    ],
    encodings: [
      { label: "DLV", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/stage.dl" },
      { label: "Clingo", url: "https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/stage_gringo.lp" }
    ]
  }
]

const argumentationEdges: Edge[] = [
  { source: "naive", target: "conflict-free", style: "solid" },
  { source: "admissible", target: "conflict-free", style: "solid" },
  { source: "stage", target: "naive", style: "solid" },
  { source: "complete", target: "admissible", style: "solid" },
  { source: "grounded", target: "complete", style: "solid" },
  { source: "preferred", target: "complete", style: "solid" },
  { source: "semi-stable", target: "preferred", style: "solid" },
  { source: "stable", target: "semi-stable", style: "solid" },
  { source: "ideal", target: "admissible", style: "solid" },
  { source: "strongly-admissible", target: "admissible", style: "solid" },
  { source: "stable", target: "stage", style: "solid" },
  { source: "ideal", target: "preferred", style: "dashed" },
  { source: "eager", target: "semi-stable", style: "dashed" },
  { source: "eager", target: "admissible", style: "solid" },
]

const downloadFile = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network response was not ok')
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
    // Fallback: open in new tab
    window.open(url, '_blank')
  }
}

// Map external URLs to local file paths
const getLocalFilePath = (url: string): string => {
  const urlMap: { [key: string]: string } = {
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/adm.dl': 'adm.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/comp.dl': 'comp.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/ground.dl': 'ground.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/prefexDLV.dl': 'preferred_dlv.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/prefex_gringo.lp': 'preferred_clingo.lp',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/semi_stable.dl': 'semi_stable_dlv.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/semi_stable_gringo.lp': 'semi_stable_clingo.lp',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/ideal.dl': 'ideal.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/str_adm.lp': 'str_adm_clingo.lp',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/naive.dl': 'naive.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/stable.dl': 'stable.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/stage.dl': 'stage_dlv.dl',
    'https://www.dbai.tuwien.ac.at/research/argumentation/aspartix/dung/stage_gringo.lp': 'stage_clingo.dl',
  }
  return urlMap[url] || url
}

function renderDefinition(def: string) {
  // Split on $...$ and alternate between text and math
  const parts = def.split(/(\$[^$]+\$)/g);
  return parts.map((part: string, i: number) =>
    part.startsWith('$') && part.endsWith('$') ? (
      <InlineMath key={i} math={part.slice(1, -1)} />
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// Custom Prolog syntax highlighting
const highlightProlog = (code: string) => {
  // Escape HTML to prevent injection
  let highlightedCode = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Use a token-based approach to avoid overlapping matches
  const tokens: Array<{ text: string; type: string }> = [];
  let currentText = highlightedCode;

  // Extract comments first
  currentText = currentText.replace(/(%.*$)/gm, (match) => {
    tokens.push({ text: match, type: 'comment' });
    return `__TOKEN_${tokens.length - 1}__`;
  });

  // Extract keywords
  currentText = currentText.replace(/\b(in|out|defeated|not_defended|arg|att|fixedPoint)\b/g, (match) => {
    tokens.push({ text: match, type: 'keyword' });
    return `__TOKEN_${tokens.length - 1}__`;
  });

  // Extract negation and rules
  currentText = currentText.replace(/\b(not|:-)\b/g, (match) => {
    tokens.push({ text: match, type: 'negation' });
    return `__TOKEN_${tokens.length - 1}__`;
  });

  // Extract variables
  currentText = currentText.replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, (match) => {
    tokens.push({ text: match, type: 'variable' });
    return `__TOKEN_${tokens.length - 1}__`;
  });

  // Extract numbers
  currentText = currentText.replace(/\b(\d+)\b/g, (match) => {
    tokens.push({ text: match, type: 'number' });
    return `__TOKEN_${tokens.length - 1}__`;
  });

  // Extract punctuation
  currentText = currentText.replace(/([:\-.,(){};!\-])/g, (match) => {
    tokens.push({ text: match, type: 'punctuation' });
    return `__TOKEN_${tokens.length - 1}__`;
  });

  // Replace tokens with styled spans
  tokens.forEach((token, index) => {
    let className = '';
    switch (token.type) {
      case 'comment':
        className = 'text-gray-500 italic';
        break;
      case 'keyword':
        className = 'text-green-600 font-semibold';
        break;
      case 'negation':
        className = 'text-red-600 font-bold';
        break;
      case 'variable':
        className = 'text-purple-600 font-semibold';
        break;
      case 'number':
        className = 'text-blue-500';
        break;
      case 'punctuation':
        className = 'text-blue-600 font-bold';
        break;
    }
    currentText = currentText.replace(`__TOKEN_${index}__`, `<span class="${className}">${token.text}</span>`);
  });

  return currentText;
}

export default function MermaidArgumentationGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [encodingDialogOpen, setEncodingDialogOpen] = useState(false)
  const [encodingContent, setEncodingContent] = useState<string>('')
  const [encodingTitle, setEncodingTitle] = useState<string>('')
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  // Generate Mermaid diagram syntax
  const generateMermaidDiagram = () => {
    let diagram = `graph BT\n`

    // Add node definitions with clear labels - using quotes to ensure text shows
    argumentationNodes.forEach((node) => {
      const nodeId = node.id.replace(/-/g, "_")
      // Use double quotes and escape any internal quotes
      const label = node.label.replace(/"/g, '\\"')
      diagram += `    ${nodeId}["${label}"]\n`
    })

    diagram += `\n`

    // Add edges
    argumentationEdges.forEach((edge) => {
      const sourceId = edge.source.replace(/-/g, "_")
      const targetId = edge.target.replace(/-/g, "_")

      if (edge.style === "dashed") {
        diagram += `    ${sourceId} -.-> ${targetId}\n`
      } else {
        diagram += `    ${sourceId} --> ${targetId}\n`
      }
    })

    // Add styling - ensure text is visible
    diagram += `\n    %% Styling\n`
    argumentationNodes.forEach((node, index) => {
      const nodeId = node.id.replace(/-/g, "_")
      const isSelected = selectedNode === node.id

      let fillColor = "#ffffff"
      let strokeColor = "#333333"
      let strokeWidth = "2px"
      const textColor = "#000000"

      if (isSelected) {
        fillColor = "#dbeafe" // Light blue background
        strokeColor = "#3b82f6"
        strokeWidth = "3px"
      }

      diagram += `    classDef node${index} fill:${fillColor},stroke:${strokeColor},stroke-width:${strokeWidth},color:${textColor},cursor:pointer\n`
      diagram += `    class ${nodeId} node${index}\n`
    })

    return diagram
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel * 1.2, 3)
    setZoomLevel(newZoom)
    applyZoom(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel / 1.2, 0.3)
    setZoomLevel(newZoom)
    applyZoom(newZoom)
  }

  const handleFitToWindow = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
    applyZoom(1)
  }

  const applyZoom = (zoom: number) => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.querySelector("svg")
      if (svg) {
        const g = svg.querySelector("g")
        if (g) {
          g.style.transform = `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`
          g.style.transformOrigin = "center center"
        }
      }
    }
  }

  const applyPan = (offset: { x: number; y: number }) => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.querySelector("svg")
      if (svg) {
        const g = svg.querySelector("g")
        if (g) {
          g.style.transform = `scale(${zoomLevel}) translate(${offset.x}px, ${offset.y}px)`
          g.style.transformOrigin = "center center"
        }
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button only
      setIsDragging(true)
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newOffset = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }
      setPanOffset(newOffset)
      applyPan(newOffset)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const setupNodeInteractions = () => {
    if (!mermaidRef.current) return

    // Find all node elements using multiple selectors
    const nodeSelectors = [".node", ".nodeLabel", '[id*="flowchart-"]', "g.node"]
    let nodeElements: Element[] = []

    nodeSelectors.forEach((selector) => {
      const elements = Array.from(mermaidRef.current?.querySelectorAll(selector) || [])
      nodeElements = [...nodeElements, ...elements]
    })

    // Remove duplicates
    nodeElements = nodeElements.filter((elem, index, self) => index === self.findIndex((e) => e === elem))

    console.log("Found node elements:", nodeElements.length)

    nodeElements.forEach((nodeElement, index) => {
      if (index >= argumentationNodes.length) return

      const nodeData = argumentationNodes[index]
      if (!nodeData) return

      // Remove existing event listeners by cloning
      const newNodeElement = nodeElement.cloneNode(true) as Element
      nodeElement.parentNode?.replaceChild(newNodeElement, nodeElement)

      // Add click handler
      newNodeElement.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        setSelectedNode(nodeData.id)
        console.log("Node clicked:", nodeData.id)
      })

        // Set cursor style
        ; (newNodeElement as HTMLElement).style.cursor = "pointer"

        // Make sure the element is clickable
        ; (newNodeElement as HTMLElement).style.cursor = "pointer"
        ; (newNodeElement as HTMLElement).style.pointerEvents = "all"
    })
  }

  useEffect(() => {
    // Initialize Mermaid with better configuration
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      themeVariables: {
        primaryColor: "#ffffff",
        primaryTextColor: "#000000",
        primaryBorderColor: "#333333",
        lineColor: "#333333",
        secondaryColor: "#ffffff",
        tertiaryColor: "#ffffff",
        background: "#ffffff",
        mainBkg: "#ffffff",
        secondBkg: "#ffffff",
        tertiaryBkg: "#ffffff",
      },
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: "basis",
        padding: 20,
      },
      fontFamily: "Arial, sans-serif",
      fontSize: 14,
    })

    if (mermaidRef.current) {
      const diagramDefinition = generateMermaidDiagram()
      console.log("Diagram definition:", diagramDefinition)

      // Clear previous content
      mermaidRef.current.innerHTML = ""

      // Render the diagram
      mermaid
        .render("mermaid-diagram", diagramDefinition)
        .then(({ svg }) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = svg

            // Setup interactions after a short delay to ensure DOM is ready
            setTimeout(() => {
              setupNodeInteractions()
              applyZoom(zoomLevel)
            }, 200 as number)
          }
        })
        .catch((error) => {
          console.error("Error rendering Mermaid diagram:", error)
        })
    }
  }, [selectedNode])

  const clearSelection = () => {
    setSelectedNode(null)
  }

  const handleEncodingClick = async (encoding: Encoding) => {
    try {
      const localFilePath = getLocalFilePath(encoding.url)
      const response = await fetch(`/api/encodings/${localFilePath}`)

      if (!response.ok) {
        throw new Error('Failed to fetch encoding file')
      }

      const content = await response.text()
      setEncodingContent(content)
      setEncodingTitle(`${encoding.label} Encoding`)
      setEncodingDialogOpen(true)
    } catch (error) {
      console.error('Error fetching encoding:', error)
      // Fallback to original download behavior
      downloadFile(encoding.url, encoding.label.replace(/\s/g, '').toLowerCase() + '.dl')
    }
  }

  const handleDownloadEncoding = () => {
    const blob = new Blob([encodingContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${encodingTitle.toLowerCase().replace(/\s/g, '_')}.dl`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const selectedNodeData = selectedNode ? argumentationNodes.find((n) => n.id === selectedNode) : null

  return (
    <div className="h-screen bg-gray-50 p-4">
      <div className="h-full max-w-full mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Argumentation Semantics Explorer</h1>
          <a
            href="https://github.com/yilinxia/argsemx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-1.5 rounded-full border border-gray-300 bg-gray-100 text-gray-900 text-base font-medium shadow-sm transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 mb-2"
            title="View on GitHub"
          >
            <Github className="w-5 h-5 mr-2" />
            <span>GitHub</span>
          </a>
        </div>
        <p className="text-gray-600">
          Interactive visualization of argumentation framework semantics. Click nodes to explore definitions and
          research papers.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Mermaid Graph Visualization */}
          <div className="lg:col-span-3">
            <Card className="relative h-full">
              <CardContent className="p-4 h-full">
                {/* Zoom Controls */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    className="bg-white/90 backdrop-blur-sm border shadow-sm hover:bg-white"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    className="bg-white/90 backdrop-blur-sm border shadow-sm hover:bg-white"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFitToWindow}
                    className="bg-white/90 backdrop-blur-sm border shadow-sm hover:bg-white"
                    title="Fit to Window"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Zoom Level Indicator */}
                <div className="absolute top-4 left-20 z-10">
                  <div className="bg-white/90 backdrop-blur-sm border shadow-sm rounded px-2 py-1 text-xs font-medium">
                    {Math.round(zoomLevel * 100)}%
                  </div>
                </div>

                {/* Clear Selection Button */}
                {selectedNode && (
                  <Button
                    variant="outline"
                    onClick={clearSelection}
                    className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border shadow-sm hover:bg-white"
                  >
                    <X className="w-4 h-4" />
                    Clear Selection
                  </Button>
                )}

                {/* Graph container with legend */}
                <div className="relative h-full">
                  {/* Full height graph container */}
                  <div
                    ref={mermaidRef}
                    className="w-full h-full flex items-center justify-center bg-white rounded-lg overflow-hidden"
                    style={{ fontSize: "14px", cursor: isDragging ? "grabbing" : "grab" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                  />

                  {/* Legend at the very bottom of graph view */}
                  <div className="absolute bottom-0 left-0 right-0 z-20">
                    <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 shadow-sm rounded-b-lg">
                      <div className="flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-gray-600"></div>
                          <span className="text-xs text-gray-600">Direct inclusion</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400"></div>
                          <span className="text-xs text-gray-600">Subset of every target set</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-4 bg-blue-100 rounded border-2 border-blue-500"></div>
                          <span className="text-xs text-gray-600">Selected node</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4 overflow-y-auto">
            {/* Instructions */}
            {!selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">
                    • <strong>Click</strong> any node to view its definition and research paper
                  </p>

                  <p className="text-sm text-gray-600">
                    • Use <strong>zoom controls</strong> to navigate the diagram
                  </p>
                  <p className="text-sm text-gray-600">
                    • <strong>Arrows</strong> show semantic relationships
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Definition Box for Selected Node */}
            {selectedNodeData && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
                    <FileText className="w-6 h-6" />
                    Definition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold text-lg mb-2 text-blue-600">
                    {selectedNodeData.fullName} ({selectedNodeData.shortLabel})
                  </h3>
                  <div className="text-base text-gray-700 mb-4">
                    {renderDefinition(selectedNodeData.definition)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Paper Details for Selected Node */}
            {selectedNodeData && selectedNodeData.papers && selectedNodeData.papers.length > 0 && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-green-700">
                    <BookOpen className="w-6 h-6" />
                    Research Papers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedNodeData.papers.map((paper, idx) => (
                    <div key={idx} className="mb-2">
                      <p className="text-base text-gray-700">
                        {paper.authors.join(", ")}. ({paper.year}). <i>{paper.title}</i>.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 bg-transparent hover:bg-green-100"
                        onClick={() => window.open(paper.url, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Paper
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Encodings for Selected Node */}
            {selectedNodeData && (
              <Card className="border-purple-200 bg-purple-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-purple-700">
                    <Code className="w-6 h-6" />
                    Encodings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedNodeData.encodings && selectedNodeData.encodings.length > 0 ? (
                    <>
                      <div className="flex gap-2">
                        {selectedNodeData.encodings.map((encoding, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 bg-transparent hover:bg-purple-100 flex-1"
                            onClick={() => handleEncodingClick(encoding)}
                          >
                            <ExternalLink className="w-4 h-4" />
                            {encoding.label}
                          </Button>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-purple-200">
                        <p className="text-xs text-purple-600 text-center">
                          Source: Database and Artificial Intelligence Group at TUWien
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-base text-gray-700">
                      No computational encodings available for {selectedNodeData.fullName.toLowerCase()} semantics.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Encoding Dialog */}
        <Dialog open={encodingDialogOpen} onOpenChange={setEncodingDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                {encodingTitle}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadEncoding}
                  className="flex items-center gap-2 ml-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="bg-gray-50 rounded-lg p-4 max-h-[60vh] overflow-y-auto">
                <div
                  className="text-sm font-mono text-gray-800 whitespace-pre-wrap break-words bg-gray-100 p-4 rounded border"
                  dangerouslySetInnerHTML={{ __html: highlightProlog(encodingContent) }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
