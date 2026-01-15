
using Microsoft.EntityFrameworkCore;
using Parking.Api.Data;
using Parking.Api.Models;

namespace Parking.Api.Services
{
    public class FaturamentoService
    {
        private readonly AppDbContext _db;
        public FaturamentoService(AppDbContext db) => _db = db;

        public async Task<List<Fatura>> GerarAsync(string competencia, CancellationToken ct = default)
        {
            // competencia formato yyyy-MM
            var part = competencia.Split('-');
            var ano = int.Parse(part[0]);
            var mes = int.Parse(part[1]);
            var ultimoDia = DateTime.DaysInMonth(ano, mes);
            var corte = new DateTime(ano, mes, ultimoDia, 23, 59, 59, DateTimeKind.Utc);
            var inicioMes = new DateTime(ano, mes, 1, 0, 0, 0, DateTimeKind.Utc);
            var diasNoMes = (decimal)ultimoDia;

            var periodos = await _db.VeiculoClienteHistoricos
                .Where(h =>
                    h.DataInicio <= corte &&
                    (h.DataFim == null || h.DataFim >= inicioMes))
                    .Join(_db.Clientes.Where(c => c.Mensalista),
                    h => h.ClienteId,
                    c => c.Id,
                    (h, c) => new
                    {
                        Historico = h,
                        Cliente = c,
                        VeiculoId = h.VeiculoId,
                    })
                    .AsNoTracking()
                    .ToListAsync(ct);

            var faturasPorCliente = periodos
                .GroupBy(p => p.Cliente.Id)
                .Select(g => new
                {
                    ClienteId = g.Key,
                    Cliente = g.First().Cliente,
                    Periodos = g.Select(p => new
                    {
                        p.VeiculoId,
                        DataInicio = p.Historico.DataInicio,
                        DataFim = p.Historico.DataFim ?? corte,
                        ValorMensalidade = p.Cliente.ValorMensalidade ?? 0m
                    }).ToList()
                })
                .ToList();

            var criadas = new List<Fatura>();

            foreach (var fatura in faturasPorCliente)
            {
                var existente = await _db.Faturas
                    .FirstOrDefaultAsync(f => f.ClienteId == fatura.ClienteId && f.Competencia == competencia, ct);

                if (existente != null) continue;

                decimal valorTotal = 0m;
                var veiculosFaturados = new HashSet<Guid>();

                foreach(var periodo in fatura.Periodos)
                {
                    var inicioEfetivo = periodo.DataInicio > inicioMes ? periodo.DataInicio : inicioMes;
                    var fimEfetivo = periodo.DataFim < corte ? periodo.DataFim : corte;

                    var dias = (int)(fimEfetivo.Date - inicioEfetivo.Date).TotalDays + 1;
                    if (dias <= 0) continue;

                    var valorProporcional = periodo.ValorMensalidade * dias / diasNoMes;
                    valorTotal += valorProporcional;

                    veiculosFaturados.Add(periodo.VeiculoId);
                }

                if(valorTotal > 0 && veiculosFaturados.Any())
                {
                    var fat = new Fatura
                    {
                        Competencia = competencia,
                        ClienteId = fatura.ClienteId,
                        Valor = Math.Round(valorTotal, 2),
                        Observacao = $"Faturamento proporcional - {veiculosFaturados.Count} veículo(s)"
                    };


                    foreach (var veiculoId in veiculosFaturados)
                        fat.Veiculos.Add(new FaturaVeiculo { FaturaId = fat.Id, VeiculoId = veiculoId });

                    _db.Faturas.Add(fat);
                    criadas.Add(fat);
                }
            }

            await _db.SaveChangesAsync(ct);
            return criadas;
        }
    }
}
