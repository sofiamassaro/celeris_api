import { query } from "../db/connection.js";

export async function listar() {
    const r = await query("SELECT * FROM tags ORDER BY nome");
    return r.rows;
}

export async function buscarPorId(id) {
    const r = await query("SELECT * FROM tags WHERE id = $1", [id]);
    return r.rows[0];
}

export async function criar(nome) {
    const r = await query(
        "INSERT INTO tags (nome) VALUES ($1) RETURNING *",
        [nome]
    );
    return r.rows[0];
}

export async function atualizar(id, nome) {
    const r = await query(
        "UPDATE tags SET nome = $1 WHERE id = $2 RETURNING *",
        [nome, id]
    );
    return r.rows[0];
}

export async function remover(id) {
    const r = await query("DELETE FROM tags WHERE id = $1", [id]);
    return r.rowCount > 0;
}