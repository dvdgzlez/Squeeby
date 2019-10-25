using System;
using System.Linq;

namespace Squeeby_App.Utils
{
    public class RandomStrings
    {
        private static Random random = new Random((int)DateTime.Now.Ticks);
        public static string Generate(int length, bool specialChars = true)
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
            if (specialChars)
            {
                chars += "+=!@#$%^&*()-_";
            }

            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
