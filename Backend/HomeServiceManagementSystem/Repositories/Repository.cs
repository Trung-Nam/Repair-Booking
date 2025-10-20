using System.Linq.Expressions;
using HomeServiceManagementSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace HomeServiceManagementSystem.Repositories
{

    public interface IRepository<T> where T: class {
        Task<T> FindByIdAsync(int id, CancellationToken ct);
        Task<IEnumerable<T>> FindAllAsync(CancellationToken ct);
        void Add(T entity);
        void Update(T entity);
        Task DeleteByIdAsync(int id, CancellationToken ct);
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression, CancellationToken ct);
        Task<int> CountAsync(CancellationToken ct);

    }

    public class Repository<T>: IRepository<T> where T: class{

        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<int> CountAsync(CancellationToken ct)
        {
            return await _dbSet.CountAsync(ct);
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression, CancellationToken ct)
        {
            return await _dbSet.Where(expression).ToListAsync(ct);
        }

        void IRepository<T>.Add(T entity)
        {
            _dbSet.Add(entity);
        }

        async Task IRepository<T>.DeleteByIdAsync(int id, CancellationToken ct)
        {
            T? entity = await _dbSet.FindAsync(id, ct);
            if (entity != null)
            {
                _dbSet.Remove(entity);
            }
        }

        async Task<IEnumerable<T>> IRepository<T>.FindAllAsync(CancellationToken ct)
        {
            var entities = await _dbSet.ToListAsync(ct);
            return entities;
        }

        async Task<T> IRepository<T>.FindByIdAsync(int id, CancellationToken ct)
        {
            var entity = await _dbSet.FindAsync(id, ct);
            return entity!;
        }

        void IRepository<T>.Update(T entity)
        {

        }

    }
    
}
