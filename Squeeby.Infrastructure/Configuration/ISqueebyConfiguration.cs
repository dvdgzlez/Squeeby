using System;
using System.Collections.Generic;
using System.Text;

namespace Squeeby.Infrastructure.Configuration
{
    public interface ISqueebyConfiguration
    {
        string GoogleClientId { get; set; }
        string GoogleSecret { get; set; }

    }
}
