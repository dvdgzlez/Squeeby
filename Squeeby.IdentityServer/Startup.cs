using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Squeeby.Infrastructure.Configuration;

namespace Squeeby.IdentityServer
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            ISqueebyConfiguration squeebyConfiguration = new SqueebyConfiguration();

            services.AddSingleton<ISqueebyConfiguration>(squeebyConfiguration);

            services.AddMvc();


            services.AddIdentityServer()
                .AddInMemoryClients(Configuration.Configuration.GetClients())
                .AddInMemoryIdentityResources(Configuration.Configuration.GetIdentityResources())
                .AddInMemoryApiResources(Configuration.Configuration.GetApiResources())
                .AddTestUsers(Configuration.Configuration.GetTestUsers())
                .AddDeveloperSigningCredential();
                
            services.AddAuthentication()
                .AddGoogle("Google", options =>
                {
                    options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;
                    options.ClientId = squeebyConfiguration.GoogleClientId;
                    options.ClientSecret = squeebyConfiguration.GoogleSecret;
                });



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();
            app.UseIdentityServer();
            app.UseMvcWithDefaultRoute();


            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Hello World!");
            });
        }
    }
}
