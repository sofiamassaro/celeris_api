import { query, pool } from "../db/connection.js";

// SELECT base que já agrega as tags de cada processo via JOIN + json_agg
const SELECT_COM_TAGS = `
    SELECT 
        p.*,
        COALESCE(
            json_agg(
                json_build_object('id', t.id, 'nome', t.nome)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'
        ) AS tags
    FROM processos p
    LEFT JOIN processos_tags pt ON pt.processo_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id
`;

export async function listar() {
    const r = await query(
        `${SELECT_COM_TAGS} GROUP BY p.id ORDER BY p.criado_em DESC`
    );
    return r.rows;
}

export async function buscarPorId(id) {
    const r = await query(
        `${SELECT_COM_TAGS} WHERE p.id = $1 GROUP BY p.id`,
        [id]
    );
    return r.rows[0];
}

export async function criar(dados) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const r = await client.query(
            `INSERT INTO processos 
             (numero, data_entrada, requerente, cpf_requerente, requerido, cpf_requerido,
              assunto, status, repetitivos, conteudo, observacoes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING *`,
            [
                dados.numero, dados.data_entrada, dados.requerente,
                dados.cpf_requerente, dados.requerido, dados.cpf_requerido,
                dados.assunto, dados.status, dados.repetitivos || 0,
                dados.conteudo, dados.observacoes
            ]
        );
        const processoId = r.rows[0].id;

        if (Array.isArray(dados.tag_ids)) {
            for (const tagId of dados.tag_ids) {
                await client.query(
                    "INSERT INTO processos_tags (processo_id, tag_id) VALUES ($1, $2)",
                    [processoId, tagId]
                );
            }
        }

        await client.query("COMMIT");
        return buscarPorId(processoId);
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

export async function atualizar(id, dados) {
    const client = await pool.connect(); // pega uma conexão exclusiva
    try {
        await client.query("BEGIN");  // inicia transação

        const r = await client.query( 
            `UPDATE processos SET
                numero = $1, data_entrada = $2, requerente = $3, cpf_requerente = $4,
                requerido = $5, cpf_requerido = $6, assunto = $7, status = $8,
                repetitivos = $9, conteudo = $10, observacoes = $11,
                atualizado_em = CURRENT_TIMESTAMP
             WHERE id = $12 RETURNING *`,
            [
                dados.numero, dados.data_entrada, dados.requerente,
                dados.cpf_requerente, dados.requerido, dados.cpf_requerido,
                dados.assunto, dados.status, dados.repetitivos || 0,
                dados.conteudo, dados.observacoes, id
            ]
        );

        if (r.rowCount === 0) {
            await client.query("ROLLBACK");
            return null;
        }

        if (Array.isArray(dados.tag_ids)) {
            await client.query("DELETE FROM processos_tags WHERE processo_id = $1", [id]);
            for (const tagId of dados.tag_ids) {
                await client.query(
                    "INSERT INTO processos_tags (processo_id, tag_id) VALUES ($1, $2)",
                    [id, tagId]
                );
            }
        }

        await client.query("COMMIT");
        return buscarPorId(id);
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}

export async function remover(id) {
    const r = await query("DELETE FROM processos WHERE id = $1", [id]);
    return r.rowCount > 0;
}