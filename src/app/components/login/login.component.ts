import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  loading: boolean = false;

  errorUser: string = '';
  errorPass: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) { 
    this.form = formBuilder.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  iniciarSesion(){
    const usuario: string = this.form.value.usuario;
    const contrasena: string = this.form.value.contrasena;

    // Simulacion de inicio de sesion con dos roles de usuario
    if(usuario.toLowerCase() == 'admin'){
      if(contrasena == '12345'){
        this.usuarioService.nombreUsuario = usuario;
        this.simularLogin();
      }else{
        this.inicioFallido("Contraseña incorrecta");
        this.errorPass = "* Contraseña no coincide";
        this.errorUser = "";
        this.form.reset();
      }
    }
    if(usuario.toLowerCase() == 'asesor'){
      if(contrasena == '123'){
        this.usuarioService.nombreUsuario = usuario;
        this.simularLogin();
      }else{
        this.inicioFallido("Contraseña incorrecta");
        this.errorPass = "* Contraseña ingresada no coincide";
        this.errorUser = "";
        this.form.reset();
      }
    }

    if(usuario.toLowerCase() != 'admin' && usuario.toLowerCase() != 'asesor'){
      this.inicioFallido("Usuario invalido");
      this.errorUser = "* Usuario ingresado no existe";
      this.errorPass = "";
      this.form.reset();
    }

  }

  // Error cuando las credenciales no coinciden
  inicioFallido(mensaje: string){
    this.snackBar.open('Inicio de sesión fallido', mensaje, {
      duration: 2000
    });
  }

  // Inicio de sesion exitosa
  simularLogin(){
    this.loading = true;
    setTimeout(()=>{
      this.router.navigate(['renticar', { outlets: { 'alquiler': ['alquileres'] } }]);
      this.loading = false;
    },1500);
  }
}
