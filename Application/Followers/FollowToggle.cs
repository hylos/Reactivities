using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>> 
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //get currently logged in user
                var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                //get user who needs to be followed
                var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                //check if we have a target
                if (target == null) return null;

                //get following from database
                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                //Check if following is null - if null create following,  if not null remove following.
                if(following == null)
                {
                    //Add following
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target,
                    };

                    _context.UserFollowings.Add(following);
                }
                else
                {
                    //Remove following 
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}
