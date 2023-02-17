using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection Services, IConfiguration config)
        {
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            Services.AddEndpointsApiExplorer();
            Services.AddSwaggerGen();

            //DbContext
            Services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));

            });

            //Add Cors Policy
            Services.AddCors(opt => {

                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                });
            });

            //add mediator
            Services.AddMediatR(typeof(List.Handler));
            //Add automapper
            Services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            //Add fluent validation
            Services.AddFluentValidationAutoValidation();
            Services.AddValidatorsFromAssemblyContaining<Create>();
            Services.AddHttpContextAccessor();
            Services.AddScoped<IUserAccessor, UserAccessor>();

            return Services;

        }
    }
}
