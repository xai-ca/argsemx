"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ExternalLink, BookOpen, FileText, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import mermaid from "mermaid"

interface Node {
  id: string
  label: string
  fullName: string
  shortLabel: string
  paper: {
    title: string
    authors: string[]
    year: number
    abstract: string
    url: string
  }
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
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "A set of arguments is conflict-free if no argument in the set attacks another argument in the set...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "naive",
    label: "Naive (Nav)",
    fullName: "Naive",
    shortLabel: "Nav",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "We study the fundamental mechanism, humans use in argumentation...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "admissible",
    label: "Admissible (Adm)",
    fullName: "Admissible",
    shortLabel: "Adm",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "A conflict-free set of arguments is admissible if it defends all its arguments...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "stage",
    label: "Stage (Stg)",
    fullName: "Stage",
    shortLabel: "Stg",
    paper: {
      title: "Ideal and stage semantics for argumentation frameworks",
      authors: ["Verheij, B."],
      year: 1996,
      abstract: "Stage semantics selects conflict-free sets that attack a maximal number of arguments...",
      url: "https://link.springer.com/chapter/10.1007/3-540-61511-3_75",
    },
  },
  {
    id: "complete",
    label: "Complete (Cmp)",
    fullName: "Complete",
    shortLabel: "Cmp",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "A complete extension is an admissible set that contains all arguments it defends...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "strongly-admissible",
    label: "Strongly Admissible (Str)",
    fullName: "Strongly Admissible",
    shortLabel: "Str",
    paper: {
      title: "Strong admissibility revisited",
      authors: ["Baroni, P.", "Giacomin, M."],
      year: 2007,
      abstract: "Strong admissibility is a refinement of admissibility that requires stronger defense conditions...",
      url: "https://link.springer.com/chapter/10.1007/978-3-540-74565-5_4",
    },
  },
  {
    id: "ideal",
    label: "Ideal (Idl)",
    fullName: "Ideal",
    shortLabel: "Idl",
    paper: {
      title: "Ideal and stage semantics for argumentation frameworks",
      authors: ["Dung, P.M.", "Mancarella, P.", "Toni, F."],
      year: 2007,
      abstract: "The ideal extension is the maximal admissible set that is contained in every preferred extension...",
      url: "https://www.sciencedirect.com/science/article/pii/S0004370206001543",
    },
  },
  {
    id: "grounded",
    label: "Grounded (Grd)",
    fullName: "Grounded",
    shortLabel: "Grd",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "The grounded extension is the minimal (w.r.t. set inclusion) complete extension...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "preferred",
    label: "Preferred (Prf)",
    fullName: "Preferred",
    shortLabel: "Prf",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "Preferred extensions are maximal complete extensions...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "semi-stable",
    label: "Semi-Stable (Sstb)",
    fullName: "Semi-Stable",
    shortLabel: "Sstb",
    paper: {
      title: "Semi-stable semantics",
      authors: ["Caminada, M."],
      year: 2006,
      abstract: "Semi-stable extensions are complete extensions with maximal range...",
      url: "https://link.springer.com/chapter/10.1007/11853886_18",
    },
  },
  {
    id: "eager",
    label: "Eager (Egr)",
    fullName: "Eager",
    shortLabel: "Egr",
    paper: {
      title: "Eager semantics for argumentation frameworks",
      authors: ["Caminada, M."],
      year: 2007,
      abstract:
        "Eager semantics is defined as the maximal complete extension that is contained in every semi-stable extension...",
      url: "https://link.springer.com/chapter/10.1007/978-3-540-74565-5_7",
    },
  },
  {
    id: "stable",
    label: "Stable (Stb)",
    fullName: "Stable",
    shortLabel: "Stb",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract:
        "A conflict-free set of arguments S is a stable extension iff S attacks every argument not in the set...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
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

const getDefinition = (nodeId: string): string => {
  const definitions: Record<string, string> = {
    "conflict-free": "A set of arguments S is conflict-free iff there are no arguments A, B ∈ S such that A attacks B.",
    admissible: "A conflict-free set of arguments S is admissible iff S defends every argument in S.",
    complete:
      "An admissible set of arguments S is a complete extension iff S contains every argument that is defended by S.",
    preferred:
      "A complete extension S is a preferred extension iff S is maximal (w.r.t. set inclusion) among complete extensions.",
    grounded: "The grounded extension is the minimal (w.r.t. set inclusion) complete extension.",
    stable:
      "A conflict-free set of arguments S is a stable extension iff S attacks every argument that does not belong to S.",
    "semi-stable": "A complete extension S is semi-stable iff S ∪ S⁺ is maximal among complete extensions.",
    ideal:
      "The ideal extension is the maximal (w.r.t. set inclusion) admissible set that is contained in every preferred extension.",
    naive:
      "A conflict-free set of arguments S is naive iff S is maximal (w.r.t. set inclusion) among conflict-free sets.",
    stage: "A conflict-free set of arguments S is a stage extension iff S ∪ S⁺ is maximal among conflict-free sets.",
    eager:
      "The eager extension is the maximal (w.r.t. set inclusion) complete extension that is contained in every semi-stable extension.",
    "strongly-admissible":
      "A conflict-free set S is strongly admissible iff S defends every argument in S against every attack, including indirect attacks.",
  }
  return definitions[nodeId] || ""
}

export default function MermaidArgumentationGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

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
      const isHovered = hoveredNode === node.id

      let fillColor = "#ffffff"
      let strokeColor = "#333333"
      let strokeWidth = "2px"
      const textColor = "#000000"

      if (isSelected) {
        strokeColor = "#3b82f6"
        strokeWidth = "3px"
      } else if (isHovered) {
        fillColor = "#f8fafc"
        strokeColor = "#6366f1"
        strokeWidth = "2px"
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
    applyZoom(1)
  }

  const applyZoom = (zoom: number) => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.querySelector("svg")
      if (svg) {
        const g = svg.querySelector("g")
        if (g) {
          g.style.transform = `scale(${zoom})`
          g.style.transformOrigin = "center center"
        }
      }
    }
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

      // Add hover handlers
      newNodeElement.addEventListener("mouseenter", () => {
        setHoveredNode(nodeData.id)
        ;(newNodeElement as HTMLElement).style.cursor = "pointer"
      })

      newNodeElement.addEventListener("mouseleave", () => {
        setHoveredNode(null)
      })

      // Make sure the element is clickable
      ;(newNodeElement as HTMLElement).style.cursor = "pointer"
      ;(newNodeElement as HTMLElement).style.pointerEvents = "all"
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
      fontSize: "14px",
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
            }, 200)
          }
        })
        .catch((error) => {
          console.error("Error rendering Mermaid diagram:", error)
        })
    }
  }, [selectedNode, hoveredNode])

  const clearSelection = () => {
    setSelectedNode(null)
  }

  const selectedNodeData = selectedNode ? argumentationNodes.find((n) => n.id === selectedNode) : null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Argumentation Semantics Explorer</h1>
          <p className="text-gray-600 mb-4">
            Interactive visualization of argumentation framework semantics. Click nodes to explore definitions and
            research papers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mermaid Graph Visualization */}
          <div className="lg:col-span-2">
            <Card className="relative">
              <CardContent className="p-4">
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

                {/* Fixed height graph container */}
                <div
                  ref={mermaidRef}
                  className="w-full h-[600px] flex items-center justify-center bg-white rounded-lg border overflow-hidden"
                  style={{ fontSize: "14px" }}
                />
              </CardContent>

              {/* Legend below the graph */}
              <div className="px-4 pb-4">
                <div className="bg-gray-50 border rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-3">Legend</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-gray-600"></div>
                      <span className="text-sm text-gray-600">Direct inclusion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-gray-400 border-dashed border-t-2 border-gray-400"></div>
                      <span className="text-sm text-gray-600">Special relationship</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-white rounded border-2 border-blue-500"></div>
                      <span className="text-sm text-gray-600">Selected node</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-4 bg-slate-50 rounded border-2 border-indigo-400"></div>
                      <span className="text-sm text-gray-600">Hovered node</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
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
                    • <strong>Hover</strong> over nodes to see visual feedback
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
                  <p className="text-base text-gray-700 mb-4">{getDefinition(selectedNodeData.id)}</p>
                </CardContent>
              </Card>
            )}

            {/* Paper Details for Selected Node */}
            {selectedNodeData && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl text-green-700">
                    <BookOpen className="w-6 h-6" />
                    Research Paper
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-base text-gray-700">
                      {selectedNodeData.paper.authors.join(", ")}. ({selectedNodeData.paper.year}).{" "}
                      <i>{selectedNodeData.paper.title}</i>.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent hover:bg-green-100"
                    onClick={() => window.open(selectedNodeData.paper.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Paper
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
