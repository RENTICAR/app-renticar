import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ListaAlquilerComponent } from '../recibir/lista-alquiler/lista-alquiler.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
    ) { }

  ngOnInit(): void {
    // Solo recupera lo que hay en el localStorage si el nombre de usuario es vacio
    if (this.usuarioService.nombreUsuario == ''){
      this.recuperarLocalStorage();
    }

    this.grabarLocalStorage();
    
    this.usuario = this.usuarioService.nombreUsuario;
  }



  /**
   * Grabar en el localstorage
   */
  grabarLocalStorage(){
    // Grabar el nombre de usuario
    localStorage.setItem("usuario", this.usuarioService.nombreUsuario);
  }

  /**
   * Recuperar lo del localstorage
   */
  recuperarLocalStorage(){
    // Recuperar el nombre de usuario
    this.usuarioService.nombreUsuario = localStorage.getItem("usuario");
  }
  

  // Ingresa al home de alquileres
  navAlquileres() {
    // Carga la busqueda de vehiculos
    this.router.navigate(['renticar', { outlets: { 'alquiler': ['alquileres']} }]);
  }

  // Ingresa al home de recibidos
  navRecibidos() {
    // Carga la lista de alquileres
    this.router.navigate(['renticar', { outlets: { 'recibido': ['recibidos'] } }]);
  }

  // Ingresa al home de vehiculos
  navVehiculos() {
    // Carga la lista de vehiculos
    this.router.navigate(['renticar', { outlets: { 'vehiculo': ['vehiculos'] } }]);
  }

  // Ingresa al home de caracteristicas
  navCaracteriticas() {
    // Carga la lista de caracteristicas
    this.router.navigate(['renticar', { outlets: { 'caracteristica': ['caracteristicas'] } }]);
  }

  // Ingresa al home de gastos
  navGastos() {
    // Carga la lista de vehiculos con gastos
    this.router.navigate(['renticar', { outlets: { 'gasto': ['gastos'] } }]);
  }

  // Ingresa al home de informes
  navInformes() {
    // Carga el generador de reportes
    this.router.navigate(['renticar', { outlets: { 'informe': ['informes'] } }]);
  }

  // Navegacion del menu de pestañas, recibe el evento cuando se cambia de pestaña
  menuTab(event) {
    // Segun el indice de la pestaña se carga contenido

    if (event.index == 0) {
      this.navAlquileres();
    }
    if (event.index == 1) {
      this.navRecibidos();
    }
    if (event.index == 2) {
      this.navVehiculos();
    }
    if (event.index == 3) {
      this.navCaracteriticas();
    }
    if (event.index == 4) {
      this.navGastos();
    }
    if (event.index == 5) {
      this.navInformes();
    }
  }

}
