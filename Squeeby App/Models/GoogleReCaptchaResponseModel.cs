using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Squeeby_App.Models
{
    public class GoogleReCaptchaResponseModel
    {
        [JsonProperty("success")]
        public bool Success { get; set; }
        [JsonProperty("score")]
        public double Score { get; set; }
        [JsonProperty("action")]
        public string Action { get; set; }
        [JsonProperty("challenge_ts")]
        public DateTime ChallengeTimestamp { get; set; }
        [JsonProperty("hostname")]
        public string Hostname { get; set; }
        [JsonProperty("error-codes")]
        public List<string> ErrorCodes { get; set; }
    }
}
