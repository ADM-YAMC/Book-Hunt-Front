import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { IResponse } from '../models/IResponse';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next
) => {
  var ser = inject(AuthService);
  const token = JSON.parse(localStorage.getItem('__user__')!);
  if (localStorage.getItem('__user__')) {
    let descodedToken = jwtDecode(token?.token);
    let date = Date.now();
    const isExpired =
      descodedToken && descodedToken.exp
        ? descodedToken.exp < date / 1000
        : false;
    if (isExpired) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton:
            'text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800',
          cancelButton:
            'text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900',
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: 'Sesión expirada',
          text: 'Su sesión a expirado. ¿Deseas seguir trabajando?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: '¡Si, seguir!',
          cancelButtonText: 'No, salir.',
          reverseButtons: false,
        })
        .then((result) => {
          if (result && result.isConfirmed) {
            ser
              .refreshToken(token?.token)
              .subscribe((res: IResponse<string>) => {
                console.log(res);
                if (!res.thereIsError && res.successful) {
                  let user = ser.getLocalStorage();
                  if (user !== null) {
                    let dataUser = {
                      ...user,
                      token: res.singleData,
                    };

                    ser.setLocalStorage(dataUser);
                    ser.alert(
                      '¡Estas devuelta!. Puedes seguir trabajando.',
                      'success'
                    );
                    window.location.reload();
                  }
                }
                // const clonedRequest = req.clone({
                //   setHeaders: {
                //     Authorization: `Bearer ${res.singleData}`,
                //   },
                // });
                const clonedRequest = req.clone({
                  headers: req.headers.set(
                    'Authorization',
                    `Bearer ${res.singleData}`
                  ),
                });
                console.log(clonedRequest);
                return next(clonedRequest);
              });
          } else if (result && result.dismiss?.toString() === 'cancel') {
            ser.logout();
          }
        });
    }
  }
  return next(req);
};
