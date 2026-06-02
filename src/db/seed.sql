-- Tags
INSERT INTO tags (nome) VALUES
    ('Direito Bancário'),
    ('Revisional de Juros'),
    ('Consumidor'),
    ('Dano Moral'),
    ('Tarifas'),
    ('Negativação'),
    ('Financiamento'),
    ('Imobiliário'),
    ('Consignado'),
    ('Revisão Contratual'),
    ('Crédito'),
    ('Fintech'),
    ('Execução'),
    ('Título Extrajudicial'),
    ('Monitória'),
    ('Cobrança'),
    ('Outros');

-- Processos
INSERT INTO processos (numero, data_entrada, requerente, cpf_requerente, requerido, cpf_requerido, assunto, status, repetitivos, conteudo) VALUES
('5003421-12.2024.8.24.0023', '2024-06-15', 'João da Silva', '032.456.789-10', 'Banco do Brasil S.A.', '00.000.000/0001-91', 'Ação Revisional de Juros — Financiamento de Veículo', 'urgente', 12, 'O autor celebrou contrato de financiamento de veículo automotor com o réu, tendo sido cobradas taxas de juros acima do limite permitido pelo Banco Central do Brasil...'),
('5003987-44.2024.8.24.0023', '2024-10-15', 'Maria Oliveira', '114.567.890-23', 'Caixa Econômica Federal', '00.360.305/0001-04', 'Revisão de Contrato de Financiamento Imobiliário', 'prioritario', 4, 'A autora contratou financiamento imobiliário pelo programa habitacional, alegando irregularidades na aplicação do índice de correção monetária durante o período de carência...'),
('5004102-88.2024.8.24.0023', '2024-06-15', 'Pedro Alves', '205.678.901-34', 'Itaú Unibanco S.A.', '60.701.190/0001-04', 'Indenização por Dano Moral — Cobrança Indevida', 'normal', 0, 'O autor foi surpreendido com cobrança indevida em sua fatura de cartão de crédito, referente a serviço que alega nunca ter contratado, sendo negativado indevidamente...'),
('5004388-21.2024.8.24.0023', '2024-06-15', 'Ana Souza', '356.789.012-45', 'Bradesco S.A.', '60.746.948/0001-12', 'Cobrança Indevida de Tarifas Bancárias', 'normal', 7, 'A autora questiona a legalidade da cobrança de tarifas de manutenção de conta corrente e pacote de serviços, alegando que as cobranças foram realizadas sem autorização expressa...'),
('5004512-67.2024.8.24.0023', '2024-06-15', 'Carlos Mendes', '478.901.234-56', 'Santander Brasil S.A.', '90.400.888/0001-42', 'Negativação Indevida no SPC/Serasa', 'urgente', 2, 'O autor teve seu nome inscrito nos órgãos de proteção ao crédito em razão de dívida que alega já ter sido quitada, requerendo tutela de urgência para exclusão imediata da negativação...'),
('5004701-33.2024.8.24.0023', '2024-06-15', 'Luciana Ferreira', '589.012.345-67', 'Nubank S.A.', '18.236.120/0001-58', 'Revisão de Limite e Contestação de Cobranças', 'normal', 1, 'A autora contesta cobranças realizadas em seu cartão de crédito, afirmando não reconhecer as transações listadas, e requer o ressarcimento dos valores debitados indevidamente...'),
('5004899-14.2024.8.24.0023', '2024-06-15', 'Roberto Lima', '623.123.456-78', 'Banco Inter S.A.', '00.000.000/0001-91', 'Revisão de Contrato de Empréstimo Consignado', 'prioritario', 3, 'O autor, servidor público aposentado, questiona a taxa de juros aplicada em seu contrato de empréstimo consignado, alegando que supera o teto estabelecido em normativa do INSS...');

-- Ligações N-N
INSERT INTO processos_tags (processo_id, tag_id)
SELECT p.id, t.id FROM processos p, tags t
WHERE p.numero = '5003421-12.2024.8.24.0023' AND t.nome IN ('Direito Bancário', 'Revisional de Juros');

INSERT INTO processos_tags (processo_id, tag_id)
SELECT p.id, t.id FROM processos p, tags t
WHERE p.numero = '5003987-44.2024.8.24.0023' AND t.nome IN ('Financiamento', 'Imobiliário');

INSERT INTO processos_tags (processo_id, tag_id)
SELECT p.id, t.id FROM processos p, tags t
WHERE p.numero = '5004102-88.2024.8.24.0023' AND t.nome IN ('Consumidor', 'Dano Moral');

INSERT INTO processos_tags (processo_id, tag_id)
SELECT p.id, t.id FROM processos p, tags t
WHERE p.numero = '5004388-21.2024.8.24.0023' AND t.nome IN ('Direito Bancário', 'Tarifas');

INSERT INTO processos_tags (processo_id, tag_id)
SELECT p.id, t.id FROM processos p, tags t
WHERE p.numero = '5004512-67.2024.8.24.0023' AND t.nome IN ('Consumidor', 'Negativação');

INSERT INTO processos_tags (processo_id, tag_id)
SELECT p.id, t.id FROM processos p, tags t
WHERE p.numero = '5004701-33.2024.8.24.0023' AND t.nome IN ('Crédito', 'Fintech');

INSERT INTO processos_tags (processo_id, tag_id)
SELECT p.id, t.id FROM processos p, tags t
WHERE p.numero = '5004899-14.2024.8.24.0023' AND t.nome IN ('Consignado', 'Revisão Contratual');