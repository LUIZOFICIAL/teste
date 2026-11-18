/**
 * ============================================================================
 * LÓGICA DA ÁRVORE BINÁRIA DE BUSCA (BST) & GERADOR DE PASSOS
 * ============================================================================
 */
class BSTNode {
  constructor(value, id) {
    this.value = value;
    this.id = id;
    this.left = null;
    this.right = null;
  }
}

let nextNodeId = 1;

function cloneTree(node) {
  if (!node) return null;
  const copy = new BSTNode(node.value, node.id);
  copy.left = cloneTree(node.left);
  copy.right = cloneTree(node.right);
  return copy;
}

function getTreeHeight(node) {
  if (!node) return -1;
  return 1 + Math.max(getTreeHeight(node.left), getTreeHeight(node.right));
}

function getNodeCount(node) {
  if (!node) return 0;
  return 1 + getNodeCount(node.left) + getNodeCount(node.right);
}

function isTreeBalanced(node) {
  function check(n) {
    if (!n) return { balanced: true, height: -1 };
    const l = check(n.left);
    const r = check(n.right);
    const balanced = l.balanced && r.balanced && Math.abs(l.height - r.height) <= 1;
    return { balanced, height: 1 + Math.max(l.height, r.height) };
  }
  return check(node).balanced;
}

/**
 * Pseudocódigos para exibição sincronizada
 */
const PSEUDOCODES = {
  insert: [
    "funcao inserir(raiz, valor):",
    "  se raiz == null: retorna novoNo(valor)",
    "  atual = raiz; pai = null",
    "  enquanto atual != null:",
    "    pai = atual",
    "    se valor == atual.valor: retorna (duplicado)",
    "    senao se valor < atual.valor: atual = atual.esq",
    "    senao: atual = atual.dir",
    "  se valor < pai.valor: pai.esq = novoNo(valor)",
    "  senao: pai.dir = novoNo(valor)"
  ],
  search: [
    "funcao buscar(raiz, valor):",
    "  atual = raiz",
    "  enquanto atual != null:",
    "    se valor == atual.valor: retorna ENCONTRADO",
    "    senao se valor < atual.valor: atual = atual.esq",
    "    senao: atual = atual.dir",
    "  retorna NAO_ENCONTRADO"
  ],
  delete: [
    "funcao remover(raiz, valor):",
    "  localizar no alvo e seu pai",
    "  caso 1 (folha): pai.filho = null",
    "  caso 2 (1 filho): pai.filho = alvo.unicoFilho",
    "  caso 3 (2 filhos):",
    "    sucessor = menorNo(alvo.dir)",
    "    alvo.valor = sucessor.valor",
    "    remover(alvo.dir, sucessor.valor)"
  ],
  inorder: [
    "funcao emOrdem(no):",
    "  se no == null: retorna",
    "  emOrdem(no.esq)      // 1. Subárvore Esquerda",
    "  visitar(no)          // 2. Processa Raiz",
    "  emOrdem(no.dir)      // 3. Subárvore Direita"
  ],
  preorder: [
    "funcao preOrdem(no):",
    "  se no == null: retorna",
    "  visitar(no)          // 1. Processa Raiz",
    "  preOrdem(no.esq)     // 2. Subárvore Esquerda",
    "  preOrdem(no.dir)     // 3. Subárvore Direita"
  ],
  postorder: [
    "funcao posOrdem(no):",
    "  se no == null: retorna",
    "  posOrdem(no.esq)     // 1. Subárvore Esquerda",
    "  posOrdem(no.dir)     // 2. Subárvore Direita",
    "  visitar(no)          // 3. Processa Raiz"
  ],
  levelorder: [
    "funcao emNivel(raiz):",
    "  fila.enfileirar(raiz)",
    "  enquanto fila nao vazia:",
    "    atual = fila.desenfileirar()",
    "    visitar(atual); enfileirar filhos(atual)"
  ]
};

/**
 * Gerador de quadros (snapshots) de execução passo a passo
 */
function buildOperationSteps(initialRoot, operation, param) {
  const steps = [];
  let workingRoot = cloneTree(initialRoot);
  let comparisons = 0;
  let visitedIds = new Set();
  let activeEdges = [];

  function pushStep({
    message,
    comparingId = null,
    foundId = null,
    targetDelId = null,
    successorId = null,
    vars = {},
    codeLine = -1,
    traversalResult = null
  }) {
    steps.push({
      tree: cloneTree(workingRoot),
      message,
      comparisons,
      visitedCount: visitedIds.size,
      visitedIds: new Set(visitedIds),
      comparingId,
      foundId,
      targetDelId,
      successorId,
      activeEdges: [...activeEdges],
      vars: {
        operacao: operation.toUpperCase(),
        valorAlvo: param !== undefined ? param : "—",
        atual: "null",
        pai: "null",
        sucessor: "null",
        ...vars
      },
      codeLine,
      traversalResult: traversalResult ? [...traversalResult] : null
    });
  }

  // -------------------- INSERÇÃO --------------------
  if (operation === "insert") {
    const val = param;
    if (!workingRoot) {
      const newNode = new BSTNode(val, nextNodeId++);
      workingRoot = newNode;
      visitedIds.add(newNode.id);
      pushStep({
        message: `A árvore estava vazia. O nó ${val} foi criado diretamente como a nova raiz.`,
        foundId: newNode.id,
        vars: { atual: "null", pai: "null", acao: "Criar Raiz" },
        codeLine: 1
      });
      return steps;
    }

    let curr = workingRoot;
    let parent = null;

    pushStep({
      message: `Iniciando inserção de ${val} a partir da raiz (${curr.value}).`,
      comparingId: curr.id,
      vars: { atual: curr.value, pai: "null" },
      codeLine: 2
    });

    while (curr !== null) {
      parent = curr;
      visitedIds.add(curr.id);
      comparisons++;

      if (val === curr.value) {
        pushStep({
          message: `Comparação #${comparisons}: ${val} == ${curr.value}. Valores duplicados não são permitidos na BST.`,
          comparingId: curr.id,
          vars: { atual: curr.value, pai: parent.value, resultado: "Duplicado" },
          codeLine: 5
        });
        return steps;
      } else if (val < curr.value) {
        pushStep({
          message: `Comparação #${comparisons}: ${val} < ${curr.value}. Seguindo para a subárvore esquerda.`,
          comparingId: curr.id,
          vars: { atual: curr.value, pai: parent.value, direcao: "Esquerda" },
          codeLine: 6
        });
        if (curr.left) {
          activeEdges.push(`${curr.id}-${curr.left.id}`);
        }
        curr = curr.left;
      } else {
        pushStep({
          message: `Comparação #${comparisons}: ${val} > ${curr.value}. Seguindo para a subárvore direita.`,
          comparingId: curr.id,
          vars: { atual: curr.value, pai: parent.value, direcao: "Direita" },
          codeLine: 7
        });
        if (curr.right) {
          activeEdges.push(`${curr.id}-${curr.right.id}`);
        }
        curr = curr.right;
      }
    }

    const newNode = new BSTNode(val, nextNodeId++);
    if (val < parent.value) {
      parent.left = newNode;
      activeEdges.push(`${parent.id}-${newNode.id}`);
      visitedIds.add(newNode.id);
      pushStep({
        message: `Posição livre encontrada à esquerda de ${parent.value}. Nó ${val} inserido com sucesso!`,
        foundId: newNode.id,
        vars: { atual: "null", pai: parent.value, posicao: "pai.esq" },
        codeLine: 8
      });
    } else {
      parent.right = newNode;
      activeEdges.push(`${parent.id}-${newNode.id}`);
      visitedIds.add(newNode.id);
      pushStep({
        message: `Posição livre encontrada à direita de ${parent.value}. Nó ${val} inserido com sucesso!`,
        foundId: newNode.id,
        vars: { atual: "null", pai: parent.value, posicao: "pai.dir" },
        codeLine: 9
      });
    }
    return steps;
  }

  // -------------------- BUSCA --------------------
  if (operation === "search") {
    const val = param;
    if (!workingRoot) {
      pushStep({
        message: `A árvore está vazia. O valor ${val} não pode ser encontrado.`,
        vars: { atual: "null", resultado: "Não encontrado" },
        codeLine: 6
      });
      return steps;
    }

    let curr = workingRoot;
    pushStep({
      message: `Iniciando busca pelo valor ${val} na raiz (${curr.value}).`,
      comparingId: curr.id,
      vars: { atual: curr.value },
      codeLine: 1
    });

    while (curr !== null) {
      visitedIds.add(curr.id);
      comparisons++;

      if (val === curr.value) {
        pushStep({
          message: `Comparação #${comparisons}: ${val} == ${curr.value}. Elemento ${val} ENCONTRADO!`,
          foundId: curr.id,
          vars: { atual: curr.value, resultado: "ENCONTRADO" },
          codeLine: 3
        });
        return steps;
      } else if (val < curr.value) {
        pushStep({
          message: `Comparação #${comparisons}: ${val} < ${curr.value}. Descartando subárvore direita e descendo à esquerda.`,
          comparingId: curr.id,
          vars: { atual: curr.value, direcao: "Esquerda" },
          codeLine: 4
        });
        if (curr.left) activeEdges.push(`${curr.id}-${curr.left.id}`);
        curr = curr.left;
      } else {
        pushStep({
          message: `Comparação #${comparisons}: ${val} > ${curr.value}. Descartando subárvore esquerda e descendo à direita.`,
          comparingId: curr.id,
          vars: { atual: curr.value, direcao: "Direita" },
          codeLine: 5
        });
        if (curr.right) activeEdges.push(`${curr.id}-${curr.right.id}`);
        curr = curr.right;
      }
    }

    pushStep({
      message: `Ponteiro atual atingiu null após ${comparisons} comparação(ões). O valor ${val} NÃO existe na árvore.`,
      vars: { atual: "null", resultado: "NÃO ENCONTRADO" },
      codeLine: 6
    });
    return steps;
  }

  // -------------------- REMOÇÃO --------------------
  if (operation === "delete") {
    const val = param;
    if (!workingRoot) {
      pushStep({
        message: `A árvore está vazia. Nada para remover.`,
        vars: { atual: "null" },
        codeLine: 1
      });
      return steps;
    }

    let curr = workingRoot;
    let parent = null;
    let isLeftChild = false;

    pushStep({
      message: `Buscando o nó ${val} para remoção a partir da raiz (${curr.value}).`,
      comparingId: curr.id,
      vars: { atual: curr.value, pai: "null" },
      codeLine: 1
    });

    while (curr !== null && curr.value !== val) {
      visitedIds.add(curr.id);
      comparisons++;
      parent = curr;

      if (val < curr.value) {
        pushStep({
          message: `Comparação #${comparisons}: ${val} < ${curr.value}. Descendo à esquerda.`,
          comparingId: curr.id,
          vars: { atual: curr.value, pai: parent.value },
          codeLine: 1
        });
        if (curr.left) activeEdges.push(`${curr.id}-${curr.left.id}`);
        isLeftChild = true;
        curr = curr.left;
      } else {
        pushStep({
          message: `Comparação #${comparisons}: ${val} > ${curr.value}. Descendo à direita.`,
          comparingId: curr.id,
          vars: { atual: curr.value, pai: parent.value },
          codeLine: 1
        });
        if (curr.right) activeEdges.push(`${curr.id}-${curr.right.id}`);
        isLeftChild = false;
        curr = curr.right;
      }
    }

    if (curr === null) {
      pushStep({
        message: `O valor ${val} não foi encontrado na árvore após ${comparisons} comparação(ões).`,
        vars: { atual: "null", pai: parent ? parent.value : "null" },
        codeLine: 1
      });
      return steps;
    }

    comparisons++;
    visitedIds.add(curr.id);

    // Caso 1: Nó Folha
    if (!curr.left && !curr.right) {
      pushStep({
        message: `Nó ${val} encontrado (Comparação #${comparisons}). Caso 1: É um nó folha (0 filhos). Será removido diretamente.`,
        targetDelId: curr.id,
        vars: { atual: curr.value, pai: parent ? parent.value : "null", caso: "1 (Folha)" },
        codeLine: 2
      });

      if (!parent) workingRoot = null;
      else if (isLeftChild) parent.left = null;
      else parent.right = null;

      pushStep({
        message: `Nó folha ${val} removido da árvore.`,
        vars: { atual: "null", pai: parent ? parent.value : "null", caso: "Concluído" },
        codeLine: 2
      });
      return steps;
    }

    // Caso 2: 1 Filho
    if (!curr.left || !curr.right) {
      const child = curr.left || curr.right;
      pushStep({
        message: `Nó ${val} encontrado (Comparação #${comparisons}). Caso 2: Possui apenas 1 filho (${child.value}). O filho assumirá seu lugar.`,
        targetDelId: curr.id,
        foundId: child.id,
        vars: { atual: curr.value, pai: parent ? parent.value : "null", filho: child.value, caso: "2 (1 Filho)" },
        codeLine: 3
      });

      if (!parent) workingRoot = child;
      else if (isLeftChild) parent.left = child;
      else parent.right = child;

      pushStep({
        message: `Nó ${val} removido e substituído diretamente por seu filho ${child.value}.`,
        foundId: child.id,
        vars: { atual: child.value, pai: parent ? parent.value : "null", caso: "Concluído" },
        codeLine: 3
      });
      return steps;
    }

    // Caso 3: 2 Filhos
    pushStep({
      message: `Nó ${val} encontrado (Comparação #${comparisons}). Caso 3: Possui 2 filhos. Buscando o sucessor in-order (menor valor da subárvore direita).`,
      targetDelId: curr.id,
      vars: { atual: curr.value, pai: parent ? parent.value : "null", caso: "3 (2 Filhos)" },
      codeLine: 5
    });

    let succParent = curr;
    let succ = curr.right;
    activeEdges.push(`${curr.id}-${succ.id}`);

    while (succ.left !== null) {
      visitedIds.add(succ.id);
      comparisons++;
      pushStep({
        message: `Buscando menor à esquerda na subárvore direita: visitando ${succ.value} (tem filho esquerdo ${succ.left.value}).`,
        targetDelId: curr.id,
        comparingId: succ.id,
        vars: { atual: curr.value, sucessor: succ.value, caso: "Buscando Sucessor" },
        codeLine: 5
      });
      activeEdges.push(`${succ.id}-${succ.left.id}`);
      succParent = succ;
      succ = succ.left;
    }

    visitedIds.add(succ.id);
    pushStep({
      message: `Sucessor in-order encontrado: ${succ.value}. Seu valor substituirá ${curr.value}.`,
      targetDelId: curr.id,
      successorId: succ.id,
      vars: { atual: curr.value, sucessor: succ.value, caso: "Sucessor Encontrado" },
      codeLine: 6
    });

    const oldVal = curr.value;
    curr.value = succ.value;

    if (succParent === curr) {
      curr.right = succ.right;
    } else {
      succParent.left = succ.right;
    }

    pushStep({
      message: `Valor ${oldVal} substituído por ${curr.value} e nó original do sucessor removido. Invariante da BST preservada!`,
      foundId: curr.id,
      vars: { atual: curr.value, sucessor: succ.value, caso: "Concluído" },
      codeLine: 7
    });
    return steps;
  }

  // -------------------- PERCURSOS --------------------
  if (["inorder", "preorder", "postorder", "levelorder"].includes(operation)) {
    const result = [];
    if (!workingRoot) {
      pushStep({
        message: `A árvore está vazia. Percurso retorna lista vazia [].`,
        traversalResult: [],
        codeLine: 1
      });
      return steps;
    }

    if (operation === "levelorder") {
      const queue = [workingRoot];
      pushStep({
        message: `Iniciando Percurso em Nível (BFS). Raiz ${workingRoot.value} inserida na fila.`,
        comparingId: workingRoot.id,
        vars: { fila: `[${workingRoot.value}]` },
        codeLine: 1,
        traversalResult: result
      });

      while (queue.length > 0) {
        const node = queue.shift();
        visitedIds.add(node.id);
        result.push(node.value);

        if (node.left) {
          queue.push(node.left);
          activeEdges.push(`${node.id}-${node.left.id}`);
        }
        if (node.right) {
          queue.push(node.right);
          activeEdges.push(`${node.id}-${node.right.id}`);
        }

        pushStep({
          message: `Desenfileirado e visitado nó ${node.value}. Fila atual: [${queue.map(n => n.value).join(", ")}].`,
          foundId: node.id,
          vars: { atual: node.value, fila: `[${queue.map(n => n.value).join(", ")}]` },
          codeLine: 4,
          traversalResult: result
        });
      }
      return steps;
    }

    // DFS Recursivos
    function dfs(node) {
      if (!node) return;

      if (operation === "preorder") {
        visitedIds.add(node.id);
        result.push(node.value);
        pushStep({
          message: `[Pré-Ordem] Visitando raiz atual: ${node.value}.`,
          foundId: node.id,
          vars: { atual: node.value, etapa: "Raiz -> Esq -> Dir" },
          codeLine: 2,
          traversalResult: result
        });
      } else {
        pushStep({
          message: `Descendo pelo nó ${node.value} (explorando subárvore esquerda primeiro).`,
          comparingId: node.id,
          vars: { atual: node.value, etapa: "Explorando Esquerda" },
          codeLine: operation === "inorder" ? 2 : 2,
          traversalResult: result
        });
      }

      if (node.left) {
        activeEdges.push(`${node.id}-${node.left.id}`);
        dfs(node.left);
      }

      if (operation === "inorder") {
        visitedIds.add(node.id);
        result.push(node.value);
        pushStep({
          message: `[Em-Ordem] Subárvore esquerda concluída. Visitando nó ${node.value} (ordem crescente).`,
          foundId: node.id,
          vars: { atual: node.value, etapa: "Esq -> Raiz -> Dir" },
          codeLine: 3,
          traversalResult: result
        });
      }

      if (node.right) {
        activeEdges.push(`${node.id}-${node.right.id}`);
        dfs(node.right);
      }

      if (operation === "postorder") {
        visitedIds.add(node.id);
        result.push(node.value);
        pushStep({
          message: `[Pós-Ordem] Subárvores esquerda e direita concluídas. Visitando nó ${node.value}.`,
          foundId: node.id,
          vars: { atual: node.value, etapa: "Esq -> Dir -> Raiz" },
          codeLine: 4,
          traversalResult: result
        });
      }
    }

    dfs(workingRoot);
    return steps;
  }

  return steps;
}

/**
 * ============================================================================
 * ESTADO GLOBAL DA APLICAÇÃO & CONTROLE DE REPRODUÇÃO
 * ============================================================================
 */
const state = {
  committedRoot: null,   // Árvore oficial antes/depois da operação
  steps: [],             // Array de snapshots da animação atual
  currentStepIdx: -1,    // Índice atual (-1 = mostra committedRoot)
  isPlaying: false,
  timerId: null,
  currentOperation: null,
  zoom: 1,
  panX: 0,
  panY: 0
};

// Elementos do DOM
const svgEl = document.getElementById("bstSvg");
const svgWrapper = document.getElementById("svgWrapper");
const emptyStateEl = document.getElementById("emptyState");
const nodeValueInput = document.getElementById("nodeValueInput");

const btnPlay = document.getElementById("btnPlay");
const btnPause = document.getElementById("btnPause");
const btnStep = document.getElementById("btnStep");
const btnReset = document.getElementById("btnReset");
const speedSelect = document.getElementById("speedSelect");

const stepCounterBadge = document.getElementById("stepCounterBadge");
const progressBarFill = document.getElementById("progressBarFill");
const execStatusPill = document.getElementById("execStatusPill");

const stepExplanationEl = document.getElementById("stepExplanation");
const logHistoryEl = document.getElementById("logHistory");
const opTypeLabel = document.getElementById("opTypeLabel");
const complexityBadge = document.getElementById("complexityBadge");

const metricComparisons = document.getElementById("metricComparisons");
const metricVisited = document.getElementById("metricVisited");
const metricNodeCount = document.getElementById("metricNodeCount");
const metricHeight = document.getElementById("metricHeight");
const metricBalance = document.getElementById("metricBalance");

const varsTableBody = document.getElementById("varsTableBody");
const traversalOutputContainer = document.getElementById("traversalOutputContainer");
const traversalOutputList = document.getElementById("traversalOutputList");
const pseudocodeBox = document.getElementById("pseudocodeBox");

/**
 * ============================================================================
 * RENDERIZAÇÃO VISUAL DA ÁRVORE EM SVG
 * ============================================================================
 */
function calculateNodePositions(root) {
  const positions = new Map();
  if (!root) return { positions, width: 900, height: 540 };

  let inorderIndex = 0;
  let maxDepth = 0;

  function assignCoords(node, depth) {
    if (!node) return;
    maxDepth = Math.max(maxDepth, depth);
    assignCoords(node.left, depth + 1);
    positions.set(node.id, {
      node,
      order: inorderIndex++,
      depth
    });
    assignCoords(node.right, depth + 1);
  }

  assignCoords(root, 0);

  const totalNodes = inorderIndex;
  const horizontalSpacing = Math.max(54, Math.min(82, 820 / Math.max(totalNodes, 1)));
  const verticalSpacing = 84;
  const paddingX = 60;
  const paddingY = 60;

  const canvasWidth = Math.max(900, totalNodes * horizontalSpacing + paddingX * 2);
  const canvasHeight = Math.max(540, (maxDepth + 1) * verticalSpacing + paddingY * 2);

  // Centraliza horizontalmente dentro do canvas
  const treePixelWidth = (totalNodes - 1) * horizontalSpacing;
  const offsetX = (canvasWidth - treePixelWidth) / 2;

  positions.forEach((pos) => {
    pos.x = offsetX + pos.order * horizontalSpacing;
    pos.y = paddingY + pos.depth * verticalSpacing;
  });

  return { positions, width: canvasWidth, height: canvasHeight };
}

function renderTree(treeRoot, highlightMeta = null) {
  svgEl.innerHTML = "";

  if (!treeRoot) {
    emptyStateEl.style.display = "flex";
    updateTreeStats(null);
    return;
  }
  emptyStateEl.style.display = "none";

  const { positions, width, height } = calculateNodePositions(treeRoot);
  svgEl.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const mainGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  mainGroup.setAttribute("transform", `translate(${state.panX}, ${state.panY}) scale(${state.zoom})`);
  svgEl.appendChild(mainGroup);

  const activeEdgeSet = new Set(highlightMeta?.activeEdges || []);

  // 1. Desenhar Arestas
  positions.forEach((pos) => {
    const { node, x, y } = pos;
    [
      { child: node.left, label: "E" },
      { child: node.right, label: "D" }
    ].forEach(({ child, label }) => {
      if (!child) return;
      const childPos = positions.get(child.id);
      if (!childPos) return;

      const edgeKey = `${node.id}-${child.id}`;
      const isEdgeActive = activeEdgeSet.has(edgeKey);

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x);
      line.setAttribute("y1", y);
      line.setAttribute("x2", childPos.x);
      line.setAttribute("y2", childPos.y);
      line.setAttribute("stroke", isEdgeActive ? "#38bdf8" : "#475569");
      line.setAttribute("stroke-width", isEdgeActive ? "3.2" : "2");
      mainGroup.appendChild(line);

      // Etiqueta discreta E/D no meio da aresta
      const midX = (x + childPos.x) / 2 + (label === "E" ? -8 : 8);
      const midY = (y + childPos.y) / 2 - 4;
      const edgeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      edgeText.setAttribute("x", midX);
      edgeText.setAttribute("y", midY);
      edgeText.setAttribute("fill", isEdgeActive ? "#7dd3fc" : "#64748b");
      edgeText.setAttribute("font-size", "10");
      edgeText.setAttribute("font-family", "var(--font-mono)");
      edgeText.setAttribute("text-anchor", "middle");
      edgeText.textContent = label;
      mainGroup.appendChild(edgeText);
    });
  });

  // 2. Desenhar Nós
  const radius = 22;
  positions.forEach((pos) => {
    const { node, x, y } = pos;
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    let fill = "#1e293b";
    let stroke = "#64748b";
    let strokeWidth = "2.5";
    let glow = "";

    if (highlightMeta) {
      if (highlightMeta.visitedIds?.has(node.id)) {
        fill = "#1d4ed8";
        stroke = "#60a5fa";
      }
      if (highlightMeta.comparingId === node.id) {
        fill = "#b45309";
        stroke = "#fbbf24";
        strokeWidth = "3.5";
        glow = "drop-shadow(0 0 8px rgba(245, 158, 11, 0.7))";
      }
      if (highlightMeta.successorId === node.id) {
        fill = "#6b21a8";
        stroke = "#c084fc";
        strokeWidth = "3.5";
        glow = "drop-shadow(0 0 8px rgba(168, 85, 247, 0.7))";
      }
      if (highlightMeta.targetDelId === node.id) {
        fill = "#991b1b";
        stroke = "#f87171";
        strokeWidth = "3.5";
        glow = "drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))";
      }
      if (highlightMeta.foundId === node.id) {
        fill = "#065f46";
        stroke = "#34d399";
        strokeWidth = "3.5";
        glow = "drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))";
      }
    }

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", fill);
    circle.setAttribute("stroke", stroke);
    circle.setAttribute("stroke-width", strokeWidth);
    if (glow) circle.style.filter = glow;
    g.appendChild(circle);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y + 5);
    text.setAttribute("fill", "#f8fafc");
    text.setAttribute("font-size", "13.5");
    text.setAttribute("font-weight", "700");
    text.setAttribute("font-family", "var(--font-mono)");
    text.setAttribute("text-anchor", "middle");
    text.textContent = node.value;
    g.appendChild(text);

    mainGroup.appendChild(g);
  });

  updateTreeStats(treeRoot);
}

/**
 * ============================================================================
 * ATUALIZAÇÃO DO PAINEL DE ESTADO, MÉTRICAS E PSEUDOCÓDIGO
 * ============================================================================
 */
function updateTreeStats(treeRoot) {
  const count = getNodeCount(treeRoot);
  const height = getTreeHeight(treeRoot);
  metricNodeCount.textContent = count;
  metricHeight.textContent = height;

  if (count === 0) {
    metricBalance.textContent = "Vazia";
    metricBalance.style.color = "var(--text-muted)";
    complexityBadge.textContent = "O(1)";
  } else {
    const balanced = isTreeBalanced(treeRoot);
    if (balanced) {
      metricBalance.textContent = "Balanceada (Ideal)";
      metricBalance.style.color = "var(--success)";
      complexityBadge.textContent = "O(log n)";
    } else if (height === count - 1 && count > 2) {
      metricBalance.textContent = "Degenerada (Pior Caso)";
      metricBalance.style.color = "var(--danger)";
      complexityBadge.textContent = "O(n)";
    } else {
      metricBalance.textContent = "Desbalanceada";
      metricBalance.style.color = "var(--warning)";
      complexityBadge.textContent = "O(h)";
    }
  }
}

function renderPseudocode(opName, activeLine = -1) {
  const lines = PSEUDOCODES[opName];
  if (!lines) {
    pseudocodeBox.innerHTML = `<div class="code-line">// Selecione uma operação para visualizar o algoritmo</div>`;
    return;
  }
  pseudocodeBox.innerHTML = lines
    .map(
      (line, idx) =>
        `<div class="code-line ${idx === activeLine ? "active-line" : ""}">${line}</div>`
    )
    .join("");
}

function renderVariables(varsObj) {
  const entries = Object.entries(varsObj);
  varsTableBody.innerHTML = entries
    .map(([k, v]) => {
      const isNull = v === "null" || v === null || v === undefined;
      return `<tr>
        <td class="var-name">${k}</td>
        <td class="var-val ${isNull ? "null" : ""}">${isNull ? "null" : v}</td>
      </tr>`;
    })
    .join("");
}

function applyStep(index) {
  if (index < 0 || index >= state.steps.length) return;
  state.currentStepIdx = index;
  const step = state.steps[index];

  renderTree(step.tree, step);

  // Explicação e histórico
  stepExplanationEl.textContent = step.message;
  logHistoryEl.innerHTML = state.steps
    .slice(0, index + 1)
    .map(
      (s, i) =>
        `<div class="log-entry ${i === index ? "active" : ""}">[${i + 1}] ${s.message}</div>`
    )
    .join("");
  logHistoryEl.scrollTop = logHistoryEl.scrollHeight;

  // Métricas
  metricComparisons.textContent = step.comparisons;
  metricVisited.textContent = step.visitedCount;

  // Variáveis
  renderVariables(step.vars);

  // Saída de percurso
  if (step.traversalResult) {
    traversalOutputContainer.style.display = "block";
    traversalOutputList.innerHTML = step.traversalResult
      .map((v) => `<span class="trav-chip">${v}</span>`)
      .join("");
  } else {
    traversalOutputContainer.style.display = "none";
  }

  // Pseudocódigo
  renderPseudocode(state.currentOperation, step.codeLine);

  // Barra de progresso
  const total = state.steps.length;
  stepCounterBadge.textContent = `Passo ${index + 1} / ${total}`;
  progressBarFill.style.width = `${((index + 1) / total) * 100}%`;

  // Se chegou ao último passo, consolida a árvore resultante
  if (index === total - 1) {
    state.committedRoot = cloneTree(step.tree);
    stopPlayback("Concluído", "status-done");
  }

  updateControlButtons();
}

/**
 * ============================================================================
 * CONTROLE DE EXECUÇÃO (PLAY, PAUSE, STEP, RESET)
 * ============================================================================
 */
function updateControlButtons() {
  const hasSteps = state.steps.length > 0;
  const isAtEnd = state.currentStepIdx >= state.steps.length - 1;

  btnPlay.disabled = !hasSteps || state.isPlaying || isAtEnd;
  btnPause.disabled = !state.isPlaying;
  btnStep.disabled = !hasSteps || state.isPlaying || isAtEnd;
  btnReset.disabled = !hasSteps || state.currentStepIdx <= 0;
}

function setStatusPill(text, cls) {
  execStatusPill.textContent = text;
  execStatusPill.className = `status-pill ${cls}`;
}

function startPlayback() {
  if (state.isPlaying || state.currentStepIdx >= state.steps.length - 1) return;
  state.isPlaying = true;
  setStatusPill("Executando", "status-running");
  updateControlButtons();

  const delay = parseInt(speedSelect.value, 10) || 850;
  state.timerId = setInterval(() => {
    if (state.currentStepIdx < state.steps.length - 1) {
      applyStep(state.currentStepIdx + 1);
    } else {
      stopPlayback("Concluído", "status-done");
    }
  }, delay);
}

function stopPlayback(label = "Pausado", cls = "status-paused") {
  state.isPlaying = false;
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  setStatusPill(label, cls);
  updateControlButtons();
}

function startNewOperation(operation, param = undefined, autoPlay = true) {
  stopPlayback("Preparando", "status-idle");

  // Garante que qualquer operação anterior inacabada seja consolidada antes de iniciar nova
  if (state.steps.length > 0 && state.currentStepIdx < state.steps.length - 1) {
    const lastStep = state.steps[state.steps.length - 1];
    state.committedRoot = cloneTree(lastStep.tree);
  }

  state.currentOperation = operation;
  opTypeLabel.textContent = operation.toUpperCase();
  state.steps = buildOperationSteps(state.committedRoot, operation, param);
  state.currentStepIdx = -1;

  if (state.steps.length > 0) {
    applyStep(0);
    if (autoPlay && state.steps.length > 1) {
      startPlayback();
    }
  }
}

/**
 * ============================================================================
 * CENÁRIOS PRÉ-CONFIGURADOS & CARREGAMENTO EM LOTE
 * ============================================================================
 */
function loadTreeInstant(values) {
  stopPlayback("Pronto", "status-idle");
  state.committedRoot = null;
  state.steps = [];
  state.currentStepIdx = -1;
  state.currentOperation = null;
  nextNodeId = 1;

  values.forEach((v) => {
    const steps = buildOperationSteps(state.committedRoot, "insert", v);
    if (steps.length > 0) {
      state.committedRoot = cloneTree(steps[steps.length - 1].tree);
    }
  });

  renderTree(state.committedRoot);
  stepCounterBadge.textContent = "Passo 0 / 0";
  progressBarFill.style.width = "0%";
  metricComparisons.textContent = "0";
  metricVisited.textContent = "0";
  opTypeLabel.textContent = "CENÁRIO";
  traversalOutputContainer.style.display = "none";
  renderPseudocode(null);
  renderVariables({
    operacao: "CARGA_CENARIO",
    nosInseridos: `[${values.join(", ")}]`,
    atual: "null"
  });
  stepExplanationEl.textContent = `Cenário carregado com ${values.length} elementos (${values.join(", ")}). Escolha uma operação acima para explorar passo a passo.`;
  logHistoryEl.innerHTML = `<div class="log-entry active">[OK] Árvore inicializada com: ${values.join(", ")}</div>`;
  updateControlButtons();
}

function loadTreeAnimated(values) {
  stopPlayback("Preparando", "status-idle");
  state.committedRoot = null;
  state.steps = [];
  state.currentStepIdx = -1;
  state.currentOperation = "insert";
  nextNodeId = 1;

  let tempRoot = null;
  const allSteps = [];
  values.forEach((v) => {
    const opSteps = buildOperationSteps(tempRoot, "insert", v);
    if (opSteps.length > 0) {
      tempRoot = cloneTree(opSteps[opSteps.length - 1].tree);
      allSteps.push(...opSteps);
    }
  });

  state.steps = allSteps;
  opTypeLabel.textContent = "INSERÇÃO EM LOTE";
  if (state.steps.length > 0) {
    applyStep(0);
    startPlayback();
  }
}

/**
 * ============================================================================
 * EVENT LISTENERS DA INTERFACE
 * ============================================================================
 */
function getParsedInputValue() {
  const raw = nodeValueInput.value.trim();
  if (raw === "") return null;
  const num = Number(raw);
  return Number.isInteger(num) ? num : null;
}

document.getElementById("btnInsert").addEventListener("click", () => {
  const val = getParsedInputValue();
  if (val === null) {
    nodeValueInput.focus();
    return;
  }
  startNewOperation("insert", val, true);
  nodeValueInput.value = "";
  nodeValueInput.focus();
});

document.getElementById("btnSearch").addEventListener("click", () => {
  const val = getParsedInputValue();
  if (val === null) {
    nodeValueInput.focus();
    return;
  }
  startNewOperation("search", val, true);
});

document.getElementById("btnDelete").addEventListener("click", () => {
  const val = getParsedInputValue();
  if (val === null) {
    nodeValueInput.focus();
    return;
  }
  startNewOperation("delete", val, true);
  nodeValueInput.value = "";
});

nodeValueInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("btnInsert").click();
  }
});

document.getElementById("btnTraverse").addEventListener("click", () => {
  const mode = document.getElementById("traversalSelect").value;
  startNewOperation(mode, undefined, true);
});

// Controles de Execução
btnPlay.addEventListener("click", startPlayback);
btnPause.addEventListener("click", () => stopPlayback("Pausado", "status-paused"));
btnStep.addEventListener("click", () => {
  if (state.currentStepIdx < state.steps.length - 1) {
    applyStep(state.currentStepIdx + 1);
  }
});
btnReset.addEventListener("click", () => {
  stopPlayback("Reiniciado", "status-idle");
  if (state.steps.length > 0) {
    applyStep(0);
  }
});

speedSelect.addEventListener("change", () => {
  if (state.isPlaying) {
    stopPlayback("Pausado", "status-paused");
    startPlayback();
  }
});

// Cenários Pré-configurados
document.getElementById("btnScenarioAvg").addEventListener("click", () => {
  loadTreeInstant([50, 30, 70, 20, 40, 60, 80]);
});

document.getElementById("btnScenarioWorst").addEventListener("click", () => {
  loadTreeInstant([10, 20, 30, 40, 50, 60]);
});

document.getElementById("btnScenarioDelete2").addEventListener("click", () => {
  loadTreeInstant([50, 30, 70, 20, 40, 60, 80, 55, 65]);
  nodeValueInput.value = "50";
  stepExplanationEl.textContent =
    "Cenário pronto! O valor 50 (raiz com 2 filhos) já está preenchido no campo. Clique em 'Remover' para observar a busca pelo sucessor in-order (55).";
});

document.getElementById("btnClearTree").addEventListener("click", () => {
  stopPlayback("Aguardando", "status-idle");
  state.committedRoot = null;
  state.steps = [];
  state.currentStepIdx = -1;
  state.currentOperation = null;
  renderTree(null);
  stepCounterBadge.textContent = "Passo 0 / 0";
  progressBarFill.style.width = "0%";
  metricComparisons.textContent = "0";
  metricVisited.textContent = "0";
  opTypeLabel.textContent = "—";
  traversalOutputContainer.style.display = "none";
  renderPseudocode(null);
  renderVariables({
    operacao: "null",
    valorAlvo: "null",
    atual: "null",
    pai: "null",
    sucessor: "null"
  });
  stepExplanationEl.textContent = "Árvore limpa. Insira um novo valor ou carregue um cenário pré-configurado.";
  logHistoryEl.innerHTML = "";
  updateControlButtons();
});

// Modal Exemplo Customizado
const customModal = document.getElementById("customModal");
document.getElementById("btnOpenCustom").addEventListener("click", () => {
  customModal.classList.add("open");
  document.getElementById("customValuesInput").focus();
});

document.getElementById("btnCancelCustom").addEventListener("click", () => {
  customModal.classList.remove("open");
});

document.getElementById("btnConfirmCustom").addEventListener("click", () => {
  const raw = document.getElementById("customValuesInput").value;
  const nums = raw
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s !== "")
    .map(Number)
    .filter((n) => Number.isInteger(n));

  if (nums.length === 0) {
    alert("Informe pelo menos um número inteiro válido.");
    return;
  }

  customModal.classList.remove("open");
  const animate = document.getElementById("customAnimateCheckbox").checked;
  if (animate) {
    loadTreeAnimated(nums);
  } else {
    loadTreeInstant(nums);
  }
});

// Zoom e Pan no SVG
document.getElementById("btnZoomIn").addEventListener("click", () => {
  state.zoom = Math.min(2.2, state.zoom + 0.15);
  rerenderCurrentView();
});

document.getElementById("btnZoomOut").addEventListener("click", () => {
  state.zoom = Math.max(0.45, state.zoom - 0.15);
  rerenderCurrentView();
});

document.getElementById("btnZoomReset").addEventListener("click", () => {
  state.zoom = 1;
  state.panX = 0;
  state.panY = 0;
  rerenderCurrentView();
});

function rerenderCurrentView() {
  if (state.currentStepIdx >= 0 && state.steps[state.currentStepIdx]) {
    const step = state.steps[state.currentStepIdx];
    renderTree(step.tree, step);
  } else {
    renderTree(state.committedRoot);
  }
}

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

svgWrapper.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragStartX = e.clientX - state.panX;
  dragStartY = e.clientY - state.panY;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  state.panX = e.clientX - dragStartX;
  state.panY = e.clientY - dragStartY;
  rerenderCurrentView();
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// Inicialização com o cenário Caso Médio carregado
loadTreeInstant([50, 30, 70, 20, 40, 60, 80]);
