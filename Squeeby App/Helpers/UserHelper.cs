using Squeeby_App.Models;
using Squeeby_App.POCO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Squeeby_App.Helpers
{
    public class UserHelper
    {
        public static bool Login(LoginModel model)
        {
            // TODO registrar al usuario a la BD
            return true;
        }

        public static bool RegisterUser(User user)
        {
            // TODO registrar al usuario a la BD
            return true;
        }

        public static void Forgot(string email)
        {
            // TODO validar que el correo exista
            // en caso que el correo sea válido enviar un link para crear una nueva contraseña
            // en caso contrario enviar mensaje de error
            return;
        }
    }
}
