"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ExternalLink, BookOpen, Code, ArrowRight } from "lucide-react"

interface Node {
  id: string
  label: string
  fullName: string
  shortLabel: string
  x: number
  y: number
  color: string
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
  label?: string
}

const argumentationNodes: Node[] = [
  {
    id: "naive",
    label: "Naive Extensions (Nav)",
    fullName: "Naive Extensions",
    shortLabel: "Nav",
    x: 400,
    y: 50,
    color: "#e9d5ff",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract:
        "We study the fundamental mechanism, humans use in argumentation, and we explore how this mechanism can be used to formalize nonmonotonic reasoning...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "conflict-free",
    label: "Conflict-Free Extensions (Cf)",
    fullName: "Conflict-Free Extensions",
    shortLabel: "Cf",
    x: 200,
    y: 150,
    color: "#f3f4f6",
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
    id: "stage",
    label: "Stage Extensions (Stg)",
    fullName: "Stage Extensions",
    shortLabel: "Stg",
    x: 600,
    y: 150,
    color: "#bfdbfe",
    paper: {
      title: "Ideal and stage semantics for argumentation frameworks",
      authors: ["Verheij, B."],
      year: 1996,
      abstract: "Stage semantics selects conflict-free sets that attack a maximal number of arguments...",
      url: "https://link.springer.com/chapter/10.1007/3-540-61511-3_75",
    },
  },
  {
    id: "admissible",
    label: "Admissible Extensions (Adm)",
    fullName: "Admissible Extensions",
    shortLabel: "Adm",
    x: 200,
    y: 250,
    color: "#f3f4f6",
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
    id: "complete",
    label: "Complete Extensions (Cmp)",
    fullName: "Complete Extensions",
    shortLabel: "Cmp",
    x: 200,
    y: 350,
    color: "#f3f4f6",
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
    id: "ideal",
    label: "Ideal Extensions (Idl)",
    fullName: "Ideal Extensions",
    shortLabel: "Idl",
    x: 350,
    y: 350,
    color: "#bbf7d0",
    paper: {
      title: "Ideal and stage semantics for argumentation frameworks",
      authors: ["Dung, P.M., Mancarella, P., Toni, F."],
      year: 2007,
      abstract: "The ideal extension is the maximal admissible set that is contained in every preferred extension...",
      url: "https://www.sciencedirect.com/science/article/pii/S0004370206001543",
    },
  },
  {
    id: "eager",
    label: "Eager Extensions (Egr)",
    fullName: "Eager Extensions",
    shortLabel: "Egr",
    x: 500,
    y: 350,
    color: "#bfdbfe",
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
    id: "strongly-admissible",
    label: "Strongly Admissible Extensions (Str)",
    fullName: "Strongly Admissible Extensions",
    shortLabel: "Str",
    x: 650,
    y: 350,
    color: "#fef3c7",
    paper: {
      title: "Strong admissibility revisited",
      authors: ["Baroni, P., Giacomin, M."],
      year: 2007,
      abstract: "Strong admissibility is a refinement of admissibility that requires stronger defense conditions...",
      url: "https://link.springer.com/chapter/10.1007/978-3-540-74565-5_4",
    },
  },
  {
    id: "grounded",
    label: "Grounded Extensions (Grd)",
    fullName: "Grounded Extensions",
    shortLabel: "Grd",
    x: 100,
    y: 450,
    color: "#f3f4f6",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "The grounded extension is the minimal complete extension...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
  {
    id: "preferred",
    label: "Preferred Extensions (Prf)",
    fullName: "Preferred Extensions",
    shortLabel: "Prf",
    x: 300,
    y: 450,
    color: "#f3f4f6",
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
    label: "Semi-Stable Extensions (Sstb)",
    fullName: "Semi-Stable Extensions",
    shortLabel: "Sstb",
    x: 400,
    y: 550,
    color: "#bfdbfe",
    paper: {
      title: "Semi-stable semantics",
      authors: ["Caminada, M."],
      year: 2006,
      abstract: "Semi-stable extensions are complete extensions with maximal range...",
      url: "https://link.springer.com/chapter/10.1007/11853886_18",
    },
  },
  {
    id: "stable",
    label: "Stable Extensions (Stb)",
    fullName: "Stable Extensions",
    shortLabel: "Stb",
    x: 400,
    y: 650,
    color: "#f3f4f6",
    paper: {
      title:
        "On the acceptability of arguments and its fundamental role in nonmonotonic reasoning, logic programming and n-person games",
      authors: ["Dung, P.M."],
      year: 1995,
      abstract: "A stable extension is a conflict-free set that attacks every argument not in the set...",
      url: "https://www.sciencedirect.com/science/article/pii/000437029400041X",
    },
  },
]

const argumentationEdges: Edge[] = [
  { source: "conflict-free", target: "naive", label: "maximal set respect to ⊆" },
  { source: "conflict-free", target: "stage", label: "S ∪ S+ is maximal" },
  { source: "admissible", target: "conflict-free", label: "each node can be defended by the set" },
  { source: "complete", target: "admissible", label: "a complete of set that every node defend" },
  { source: "complete", target: "grounded", label: "minimum" },
  { source: "complete", target: "preferred", label: "maximum" },
  { source: "complete", target: "ideal", label: "maximum" },
  { source: "complete", target: "eager", label: "maximum" },
  { source: "admissible", target: "strongly-admissible", label: "min-max numbering" },
  { source: "ideal", target: "preferred", label: "maximum" },
  { source: "eager", target: "strongly-admissible" },
  { source: "preferred", target: "semi-stable", label: "S ∪ S+ is maximal" },
  { source: "semi-stable", target: "stable" },
  { source: "strongly-admissible", target: "semi-stable" },
  { source: "strongly-admissible", target: "stage" },
]

const minimalExamples: Record<string, string> = {
  "conflict-free-admissible": `# Conflict-free to Admissible Extension
# A conflict-free set becomes admissible when it defends all its arguments

class ArgumentationFramework:
    def __init__(self, arguments, attacks):
        self.arguments = arguments
        self.attacks = attacks
    
    def is_conflict_free(self, extension):
        """Check if extension is conflict-free"""
        for arg1 in extension:
            for arg2 in extension:
                if (arg1, arg2) in self.attacks:
                    return False
        return True
    
    def defends(self, extension, argument):
        """Check if extension defends argument"""
        for attacker, target in self.attacks:
            if target == argument and attacker not in extension:
                # Check if extension attacks the attacker
                defended = False
                for defender in extension:
                    if (defender, attacker) in self.attacks:
                        defended = True
                        break
                if not defended:
                    return False
        return True
    
    def is_admissible(self, extension):
        """Check if extension is admissible"""
        if not self.is_conflict_free(extension):
            return False
        
        for arg in extension:
            if not self.defends(extension, arg):
                return False
        return True

# Example usage
af = ArgumentationFramework(
    arguments=['a', 'b', 'c'],
    attacks=[('a', 'b'), ('b', 'c'), ('c', 'a')]
)

print(f"Is {{a}} conflict-free? {af.is_conflict_free({'a'})}")
print(f"Is {{a}} admissible? {af.is_admissible({'a'})}")`,
  "admissible-conflict-free": `# Conflict-free to Admissible Extension...`,
  "complete-preferred": `# Complete to Preferred Extension
# Preferred extensions are maximal complete extensions

def find_preferred_extensions(af):
    """Find all preferred extensions (maximal complete extensions)"""
    complete_extensions = find_complete_extensions(af)
    preferred = []
    
    for ext1 in complete_extensions:
        is_maximal = True
        for ext2 in complete_extensions:
            if ext1 != ext2 and ext1.issubset(ext2):
                is_maximal = False
                break
        if is_maximal:
            preferred.append(ext1)
    
    return preferred

def find_complete_extensions(af):
    """Find all complete extensions"""
    complete = []
    # Generate all possible subsets
    for subset in powerset(af.arguments):
        if is_complete(af, subset):
            complete.append(set(subset))
    return complete

def is_complete(af, extension):
    """Check if extension is complete"""
    if not af.is_admissible(extension):
        return False
    
    # Check if extension contains all arguments it defends
    for arg in af.arguments:
        if arg not in extension and af.defends(extension, arg):
            return False
    
    return True

# Example: In a 3-argument cycle, preferred extensions are singletons
af = ArgumentationFramework(['a', 'b', 'c'], [('a','b'), ('b','c'), ('c','a')])
preferred = find_preferred_extensions(af)
print(f"Preferred extensions: {preferred}")  # [{'a'}, {'b'}, {'c'}]`,
  "preferred-complete": `# Complete to Preferred Extension...`,
  "complete-grounded": `# Complete to Grounded Extension
# Grounded extension is the minimal complete extension

def find_grounded_extension(af):
    """Find the grounded extension (minimal complete extension)"""
    # Start with empty set
    grounded = set()
    changed = True
    
    while changed:
        changed = False
        # Add all unattacked arguments
        for arg in af.arguments:
            if arg not in grounded:
                is_attacked = False
                for attacker, target in af.attacks:
                    if target == arg and attacker not in grounded:
                        # Check if attacker is attacked by grounded
                        attacker_defeated = False
                        for defender in grounded:
                            if (defender, attacker) in af.attacks:
                                attacker_defeated = True
                                break
                        if not attacker_defeated:
                            is_attacked = True
                            break
                
                if not is_attacked:
                    grounded.add(arg)
                    changed = True
    
    return grounded

# Example: Simple case
af = ArgumentationFramework(['a', 'b'], [('a', 'b')])
grounded = find_grounded_extension(af)
print(f"Grounded extension: {grounded}")  # {'a'}`,
  "grounded-complete": `# Complete to Grounded Extension...`,
  "complete-ideal": `# Complete to Ideal Extension
# Ideal extension is maximal admissible contained in all preferred extensions

def find_ideal_extension(af):
    """Find the ideal extension"""
    preferred_extensions = find_preferred_extensions(af)
    
    if not preferred_extensions:
        return set()
    
    # Find intersection of all preferred extensions
    intersection = preferred_extensions[0].copy()
    for pref_ext in preferred_extensions[1:]:
        intersection = intersection.intersection(pref_ext)
    
    # Find maximal admissible subset contained in intersection
    ideal = set()
    for subset in powerset(intersection):
        if af.is_admissible(set(subset)) and len(subset) > len(ideal):
            ideal = set(subset)
    
    return ideal

# Example usage
af = ArgumentationFramework(['a', 'b', 'c', 'd'], 
                          [('a', 'b'), ('b', 'a'), ('c', 'd')])
ideal = find_ideal_extension(af)
print(f"Ideal extension: {ideal}")`,
  "ideal-complete": `# Complete to Ideal Extension...`,
  "conflict-free-naive": `# Conflict-free to Naive Extension
# Naive extensions are maximal conflict-free sets

def find_naive_extensions(af):
    """Find all naive extensions (maximal conflict-free sets)"""
    naive_extensions = []
    
    # Generate all conflict-free sets
    conflict_free_sets = []
    for subset in powerset(af.arguments):
        if af.is_conflict_free(set(subset)):
            conflict_free_sets.append(set(subset))
    
    # Find maximal ones
    for cf_set in conflict_free_sets:
        is_maximal = True
        for other_set in conflict_free_sets:
            if cf_set != other_set and cf_set.issubset(other_set):
                is_maximal = False
                break
        if is_maximal:
            naive_extensions.append(cf_set)
    
    return naive_extensions

# Example: In a symmetric attack, naive extensions are singletons
af = ArgumentationFramework(['a', 'b'], [('a', 'b'), ('b', 'a')])
naive = find_naive_extensions(af)
print(f"Naive extensions: {naive}")  # [{'a'}, {'b'}]`,
  "naive-conflict-free": `# Conflict-free to Naive Extension...`,
  "conflict-free-stage": `# Conflict-free to Stage Extension
# Stage extensions maximize the range (attacked arguments)

def find_stage_extensions(af):
    """Find all stage extensions"""
    stage_extensions = []
    conflict_free_sets = []
    
    # Generate all conflict-free sets
    for subset in powerset(af.arguments):
        if af.is_conflict_free(set(subset)):
            conflict_free_sets.append(set(subset))
    
    # Calculate range for each conflict-free set
    max_range_size = 0
    for cf_set in conflict_free_sets:
        range_set = cf_set.copy()
        # Add all arguments attacked by cf_set
        for arg in cf_set:
            for attacker, target in af.attacks:
                if attacker == arg:
                    range_set.add(target)
        
        if len(range_set) > max_range_size:
            max_range_size = len(range_set)
            stage_extensions = [cf_set]
        elif len(range_set) == max_range_size:
            stage_extensions.append(cf_set)
    
    return stage_extensions

# Example usage
af = ArgumentationFramework(['a', 'b', 'c'], [('a', 'b'), ('b', 'c')])
stage = find_stage_extensions(af)
print(f"Stage extensions: {stage}")`,
  "stage-conflict-free": `# Conflict-free to Stage Extension...`,
}

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

export default function InteractiveGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const handleNodeClick = (node: Node) => {
    setSelectedNode(node.id)
    setSelectedEdge(null)
  }

  const handleEdgeClick = (edge: Edge) => {
    setSelectedEdge(edge)
    setSelectedNode(null)
  }

  const clearSelection = () => {
    setSelectedNode(null)
    setSelectedEdge(null)
  }

  const selectedNodeData = selectedNode ? argumentationNodes.find((n) => n.id === selectedNode) : null
  const selectedEdgeNodes = selectedEdge
    ? {
        source: argumentationNodes.find((n) => n.id === selectedEdge.source),
        target: argumentationNodes.find((n) => n.id === selectedEdge.target),
      }
    : null

  const edgeExample = selectedEdge
    ? minimalExamples[`${selectedEdge.source}-${selectedEdge.target}`] ||
      minimalExamples[`${selectedEdge.target}-${selectedEdge.source}`]
    : null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Argumentation Semantics Graph</h1>
          <p className="text-gray-600">Click nodes to view definitions and papers, click edges to see relationships</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graph Visualization */}
          <div className="lg:col-span-2">
            <Card className="h-[750px] relative">
              <CardContent className="p-0 h-full">
                {/* Clear Selection Button */}
                {(selectedNode || selectedEdge) && (
                  <Button
                    variant="outline"
                    onClick={clearSelection}
                    className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm border shadow-sm"
                  >
                    <X className="w-4 h-4" />
                    Clear Selection
                  </Button>
                )}

                <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 750" className="border rounded-lg">
                  {/* Edges */}
                  {argumentationEdges.map((edge, index) => {
                    const sourceNode = argumentationNodes.find((n) => n.id === edge.source)
                    const targetNode = argumentationNodes.find((n) => n.id === edge.target)
                    if (!sourceNode || !targetNode) return null

                    const isSelected = selectedEdge?.source === edge.source && selectedEdge?.target === edge.target

                    return (
                      <g key={index}>
                        <line
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={isSelected ? "#3b82f6" : "#64748b"}
                          strokeWidth={isSelected ? "3" : "2"}
                          markerEnd={isSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)"}
                          className="cursor-pointer hover:stroke-blue-400 transition-colors"
                          onClick={() => handleEdgeClick(edge)}
                        />
                        {edge.label && (
                          <text
                            x={(sourceNode.x + targetNode.x) / 2}
                            y={(sourceNode.y + targetNode.y) / 2 - 8}
                            textAnchor="middle"
                            className="text-xs fill-gray-600 font-medium pointer-events-none"
                            style={{ fontSize: "10px" }}
                          >
                            {edge.label}
                          </text>
                        )}
                      </g>
                    )
                  })}

                  {/* Arrow marker */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="5"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <polygon points="0 2, 8 5, 0 8" fill="#64748b" stroke="#64748b" strokeWidth="1" />
                    </marker>
                    <marker
                      id="arrowhead-selected"
                      markerWidth="10"
                      markerHeight="10"
                      refX="8"
                      refY="5"
                      orient="auto"
                      markerUnits="userSpaceOnUse"
                    >
                      <polygon points="0 2, 8 5, 0 8" fill="#3b82f6" stroke="#3b82f6" strokeWidth="1" />
                    </marker>
                  </defs>

                  {/* Nodes */}
                  {argumentationNodes.map((node) => (
                    <g key={node.id}>
                      <rect
                        x={node.x - 70}
                        y={node.y - 30}
                        width="140"
                        height="60"
                        rx="8"
                        fill={selectedNode === node.id ? "#3b82f6" : node.color}
                        stroke={selectedNode === node.id ? "#1d4ed8" : "#94a3b8"}
                        strokeWidth="2"
                        className="cursor-pointer hover:stroke-blue-400 transition-colors"
                        onClick={() => handleNodeClick(node)}
                      />
                      <text
                        x={node.x}
                        y={node.y - 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-semibold pointer-events-none"
                        fill={selectedNode === node.id ? "#ffffff" : "#374151"}
                        style={{ fontSize: "11px" }}
                      >
                        {node.fullName}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 8}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs pointer-events-none"
                        fill={selectedNode === node.id ? "#ffffff" : "#6b7280"}
                        style={{ fontSize: "10px" }}
                      >
                        ({node.shortLabel})
                      </text>
                    </g>
                  ))}
                </svg>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Definition Box for Single Node */}
            {selectedNodeData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5" />
                    Definition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{getDefinition(selectedNodeData.id)}</p>
                </CardContent>
              </Card>
            )}

            {/* Definitions for Edge Selection */}
            {selectedEdgeNodes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ArrowRight className="w-5 h-5" />
                    Relationship Definitions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-blue-600 mb-1">
                      {selectedEdgeNodes.source?.fullName} ({selectedEdgeNodes.source?.shortLabel})
                    </h4>
                    <p className="text-sm text-gray-700">{getDefinition(selectedEdgeNodes.source?.id || "")}</p>
                  </div>
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-sm text-green-600 mb-1">
                      {selectedEdgeNodes.target?.fullName} ({selectedEdgeNodes.target?.shortLabel})
                    </h4>
                    <p className="text-sm text-gray-700">{getDefinition(selectedEdgeNodes.target?.id || "")}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Paper Details for Single Node */}
            {selectedNodeData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Paper Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-medium text-base">{selectedNodeData.paper.title}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedNodeData.paper.authors.join(", ")} ({selectedNodeData.paper.year})
                    </p>
                  </div>
                  <p className="text-sm text-gray-700">{selectedNodeData.paper.abstract}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent"
                    onClick={() => window.open(selectedNodeData.paper.url, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Paper
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Minimal Example for Edge */}
            {edgeExample && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Minimal Example
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-100 p-3 rounded-md overflow-x-auto">
                    <code>{edgeExample}</code>
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
