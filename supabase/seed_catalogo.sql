-- Catálogo inicial real, tomado del manual de WizPOS (precios observados en
-- Progreso, junio 2026, y del addendum de creación masiva de Ristoris).
-- Corre una sola vez; si ya existen categorías no duplica (usa nombre único
-- por conveniencia acá, aunque el esquema no lo obliga).

insert into categorias (nombre, orden)
select v.nombre, v.orden
from (values
  ('GELATO ARTESANAL', 1),
  ('GELATO PREMIUM', 2),
  ('BEBIDAS', 3),
  ('CAFE', 4),
  ('COMIDAS', 5),
  ('RISTORIS', 6)
) as v(nombre, orden)
where not exists (select 1 from categorias c where c.nombre = v.nombre);

do $$
declare
  v_artesanal uuid; v_premium uuid; v_bebidas uuid; v_cafe uuid; v_comidas uuid; v_ristoris uuid;
begin
  select id into v_artesanal from categorias where nombre = 'GELATO ARTESANAL';
  select id into v_premium from categorias where nombre = 'GELATO PREMIUM';
  select id into v_bebidas from categorias where nombre = 'BEBIDAS';
  select id into v_cafe from categorias where nombre = 'CAFE';
  select id into v_comidas from categorias where nombre = 'COMIDAS';
  select id into v_ristoris from categorias where nombre = 'RISTORIS';

  insert into productos (codigo, nombre, categoria_id, precio, impuesto1_tasa) values
    ('1001', 'COPPA CLASSICA', v_artesanal, 115.00, 0.15),
    ('1002', 'COPPA GRANDE', v_artesanal, 140.00, 0.15),
    ('1003', 'CONO CLASSICO', v_artesanal, 115.00, 0.15),
    ('1004', 'CONO PICCOLO', v_artesanal, 95.00, 0.15),
    ('1005', 'COPPA WAFFLE GRANDE', v_artesanal, 145.00, 0.15),
    ('1006', 'GELATO SIN AZUCAR', v_artesanal, 25.00, 0.15),
    ('1007', 'TO GO', v_artesanal, 270.00, 0.15),
    ('1008', 'PARA LLEVAR 1 KILO', v_artesanal, 495.00, 0.15),
    ('1009', 'PARA LLEVAR 1.5 KILO', v_artesanal, 650.00, 0.15),
    ('1010', 'FRULLATO (GELATO SHAKE)', v_artesanal, 135.00, 0.15),
    ('1011', 'BANANA SPLIT', v_artesanal, 165.00, 0.15),
    ('1012', 'AFFOGATTO AL CAFE', v_artesanal, 120.00, 0.15),
    ('1013', 'EXTRA CONO WAFFLE', v_artesanal, 15.00, 0.15),

    ('2001', 'COPPA CLASSICA PREMIUM', v_premium, 130.00, 0.15),
    ('2002', 'COPPA GRANDE PREMIUM', v_premium, 155.00, 0.15),

    ('3001', 'AGUA', v_bebidas, 30.00, 0.15),

    ('4001', 'CAFE CON LECHE C', v_cafe, 65.00, 0.15),

    ('5001', 'CREPA', v_comidas, 180.00, 0.15),

    ('6001', 'PESTO DI FRAGOLE VASO VETRO ML 580', v_ristoris, 500.00, 0.15),
    ('6002', 'PESTO DI ANANAS VASO VETRO ML 580', v_ristoris, 500.00, 0.15),
    ('6003', 'SALSA PRONTA PER BRUSCHETTA ML 1062', v_ristoris, 350.00, 0.15),
    ('6004', 'POLVERE DI TARTUFO BOTTIGLIA 50ML', v_ristoris, 550.00, 0.15),
    ('6005', 'POMODORI SECCHI VASO VETRO ML 3100', v_ristoris, 1100.00, 0.15)
  on conflict (codigo) do nothing;
end $$;
