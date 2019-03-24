using System;
using System.Collections.Generic;
using System.Text;

namespace Squeeby.Infrastructure.Configuration
{
    public class SqueebyConfiguration : ISqueebyConfiguration
    {

        /*Google OAuth Credentials:
         *ClientID: 750885240247-c8f033cjb9041tlhqi8u02guufk296j6.apps.googleusercontent.com
         *ClientSecret: dOviLyM1aSNSvcoMhPlyOWC_
         */


        public SqueebyConfiguration()
        {
            this.GoogleClientId = "750885240247-c8f033cjb9041tlhqi8u02guufk296j6.apps.googleusercontent.com";
            this.GoogleSecret = "dOviLyM1aSNSvcoMhPlyOWC_";
        }
        public string GoogleClientId { get; set; }
        public string GoogleSecret { get; set; }
        
    }
}
