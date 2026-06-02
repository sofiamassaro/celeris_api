import * as repo from "../repositories/tags.repository.js";

export async function listar(req, res, next) {
    try {
        const tags = await repo.listar();
        res.json(tags);
    } catch (e) { next(e); }
}

export async function buscar(req, res, next) {
    try {
        const tag = await repo.buscarPorId(req.params.id);
        if (!tag) return res.status(404).json({ erro: "Tag não encontrada" });
        res.json(tag);
    } catch (e) { next(e); }
}

export async function criar(req, res, next) {
    try {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" });
        const tag = await repo.criar(nome);
        res.status(201).json(tag);
    } catch (e) {
        if (e.code === "23505") {
            return res.status(409).json({ erro: "Tag já existe" });
        }
        next(e);
    }
}

export async function atualizar(req, res, next) {
    try {
        const { nome } = req.body;
        if (!nome) return res.status(400).json({ erro: "Nome é obrigatório" });
        const tag = await repo.atualizar(req.params.id, nome);
        if (!tag) return res.status(404).json({ erro: "Tag não encontrada" });
        res.json(tag);
    } catch (e) {
        if (e.code === "23505") {
            return res.status(409).json({ erro: "Já existe tag com esse nome" });
        }
        next(e);
    }
}

export async function remover(req, res, next) {
    try {
        const ok = await repo.remover(req.params.id);
        if (!ok) return res.status(404).json({ erro: "Tag não encontrada" });
        res.status(204).end();
    } catch (e) { next(e); }
}