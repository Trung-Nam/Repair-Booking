using HomeServiceManagementSystem.Data;
using HomeServiceManagementSystem.Dtos;
using HomeServiceManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeServiceManagementSystem.Repositories
{

    public interface IServiceRepository: IRepository<Service>{

        Task<PageResult<Service>> GetServicesAsync(ServiceFilter filter, CancellationToken ct = default);

    }

    public class ServiceRepository : Repository<Service>, IServiceRepository
    {
        public ServiceRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<PageResult<Service>> GetServicesAsync(ServiceFilter filter, CancellationToken ct = default)
        {
            var query = _dbSet.AsNoTracking().AsQueryable();
            
            if (filter.Field == 1)
            {
                query = query.Where(service => service.Name.Contains(filter.Keyword!));
            }
            else if (filter.Field == 2) { 
                query = query.Where(service => service.Category.Contains(filter.Keyword!));
            }else if (filter.Field == 3) {
                query = query.Where(service => service.Category.Contains(filter.Keyword!) || service.Name.Contains(filter.Keyword!));
            }
            if (filter.FromPrice != null)
            {
                query = query.Where(service => service.Price >= filter.FromPrice && service.Price <= filter.ToPrice);
            }
            var totalItems = await query.CountAsync(ct);
            query = query.Skip((filter.PageNumber - 1) * filter.PageSize).Take(filter.PageSize);
            var items = await query.ToListAsync(ct);
            return new PageResult<Service> { Items = items, PageSize = filter.PageSize, Page = filter.PageNumber, TotalItems = totalItems };
        }
    }
}
