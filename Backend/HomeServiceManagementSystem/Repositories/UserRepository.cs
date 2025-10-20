using HomeServiceManagementSystem.Data;
using HomeServiceManagementSystem.Dtos;
using HomeServiceManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace HomeServiceManagementSystem.Repositories
{

    public interface IUserRepository: IRepository<User> {
    
        Task<User> FindByEmailAsync(string email, CancellationToken ct = default);
        Task<User> FindByPhoneNumberAsync(string phoneNumber, CancellationToken ct = default);
        Task<PageResult<User>> GetAllEmployees(UserFilter filter, CancellationToken ct = default);

    }
    public class UserRepository : Repository<User>, IUserRepository
    {


        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<PageResult<User>> GetAllEmployees(UserFilter filter, CancellationToken ct = default)
        {
            var query = _dbSet.AsNoTracking()
                        .AsQueryable();
            if(filter.Keyword != null)
            {
                if(filter.Field == 1)
                {
                    query = query.Where(e => e.Fullname.Contains(filter.Keyword));
                }else if(filter.Field == 2)
                {
                    query = query.Where(e => e.Email.Contains(filter.Keyword));
                }else if(filter.Field == 3)
                {
                    query = query.Where(e => e.PhoneNumber.Contains(filter.Keyword));
                }
                else
                {
                    query = query.Where(e => e.Fullname.Contains(filter.Keyword) ||
                                        e.Email.Contains(filter.Keyword) ||
                                        e.PhoneNumber.Contains(filter.Keyword));
                }
            }
            query = query.Where(e => e.Role == Role.EMPLOYEE);
            var totalItems = await query.CountAsync(ct);
            var items = await query.Skip((filter.PageNumber - 1) * filter.PageSize).Take(filter.PageSize).ToListAsync(ct);
            return new PageResult<User> { Items = items, Page = filter.PageNumber, PageSize = filter.PageSize, TotalItems = totalItems };
        }

        async Task<User> IUserRepository.FindByEmailAsync(string email, CancellationToken ct)
        {

            return await _dbSet.Where(user => user.Email == email).FirstOrDefaultAsync(ct);

        }

        async Task<User> IUserRepository.FindByPhoneNumberAsync(string phoneNumber, CancellationToken ct)
        {
            return await _dbSet.Where(user => user.PhoneNumber == phoneNumber).FirstOrDefaultAsync(ct);
        }


    }
}
