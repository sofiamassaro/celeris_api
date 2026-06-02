import * as repo from "../repositories/processos.repository.js";

const CAMPOS_OBRIGATORIOS = [
    "numero", "data_entrada", "requerente", "requerido", "assunto", "status"
];

const STATUS_VALIDOS = ["normal", "prioritario", "urgente"];

function validar(dados) {
    const faltando = CAMPOS_OBRIGATORIOS.filter(c => !dados[c]);
    if (faltando.length > 0) {
        return `Campos obrigatórios faltando: ${faltando.join(", ")}`;
    }
    if (!STATUS_VALIDOS.includes(dados.status)) {
        return `Status inválido. Use: ${STATUS_VALIDOS.join(", ")}`;
    }
    return null;
}

export async function listar(req, res, next) {
    try {
        const processos = await repo.listar();
        res.json(processos);
    } catch (e) { next(e); }
}

export async function buscar(req, res, next) {
    try {
        const processo = await repo.buscarPorId(req.params.id);
        if (!processo) return res.status(404).json({ erro: "Processo não encontrado" });
        res.json(processo);
    } catch (e) { next(e); }
}

export async function criar(req, res, next) {
    try {
        const erro = validar(req.body);
        if (erro) return res.status(400).json({ erro });
        const processo = await repo.criar(req.body);
        res.status(201).json(processo);
    } catch (e) {
        if (e.code === "23505") {
            return res.status(409).json({ erro: "Número de processo já cadastrado" });
        }
        next(e);
    }
}

export async function atualizar(req, res, next) {
    try {
        const erro = validar(req.body);
        if (erro) return res.status(400).json({ erro });
        const processo = await repo.atualizar(req.params.id, req.body);
        if (!processo) return res.status(404).json({ erro: "Processo não encontrado" });
        res.json(processo);
    } catch (e) {
        if (e.code === "23505") {
            return res.status(409).json({ erro: "Número de processo já cadastrado" });
        }
        next(e);
    }
}

export async function remover(req, res, next) {
    try {
        const ok = await repo.remover(req.params.id);
        if (!ok) return res.status(404).json({ erro: "Processo não encontrado" });
        res.status(204).end();
    } catch (e) { next(e); }
}