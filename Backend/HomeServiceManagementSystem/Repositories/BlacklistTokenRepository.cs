using HomeServiceManagementSystem.Data;
using HomeServiceManagementSystem.Models;

namespace HomeServiceManagementSystem.Repositories
{

    public interface IBlacklistTokenRepository : IRepository<BlacklistToken>{
    }

    public class BlacklistTokenRepository : Repository<BlacklistToken>, IBlacklistTokenRepository
    {
        public BlacklistTokenRepository(AppDbContext context) : base(context){
        }

    }

}
