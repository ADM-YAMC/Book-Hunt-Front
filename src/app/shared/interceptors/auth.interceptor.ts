import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  let clonedRequest;

  if (localStorage.getItem('__user__')) {
    let token = JSON.parse(localStorage.getItem('__user__')!).token;
    clonedRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  } else {
    clonedRequest = request.clone({});
  }
  //console.log(clonedRequest);
  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        alert('No estás autorizado a consultar este servicio.', 'error');
      }
      return throwError(() => error);
    })
  );
};

function alert(message: string, icon: any) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: icon,
    title: message,
  });
}
