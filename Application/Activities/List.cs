using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }
        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            //instead of returnning Activty in the list, we will return ActivityDto.
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                //below line works which is eagerly loading but bcoz we are also returning alot of fields such as phonenumbers n
                //other columns we don't need. we will use projection. we can also pass quiries to directly to entity framework core using Select method
                //var activities = await _context.Activities
                //    .Include(a => a.Attendees)
                //    .ThenInclude(u => u.AppUser)
                //    .ToListAsync(cancellationToken);

                var activities = await _context.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync(cancellationToken);

                //this line was used with eagerly loading, as per commented code above
                //var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);

                //return Result<List<ActivityDto>>.Success(activitiesToReturn);
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}
