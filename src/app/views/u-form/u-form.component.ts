import { User } from './../../../assets/Interfaces/User';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from './../../components/service.service';

import { Component, OnInit } from '@angular/core';
import emailMask from 'text-mask-addons/dist/emailMask';
import {MatSnackBar} from '@angular/material/snack-bar';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-u-form',
  templateUrl: './u-form.component.html',
  styleUrls: ['./u-form.component.css']
})
export class UFormComponent implements OnInit {
  hide:boolean=true;
  user: User; 
  hidePassword: boolean;
  id:string
  emailMask = emailMask;
  hideIt:boolean
  control:any;
  maxDate = new Date();

  constructor(private service: ServiceService,private router: Router,
    private message: MatSnackBar,private spinner: NgxSpinnerService, 
    private activeRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.hideIt = false;
    this.hidePassword = false;
    this.id = this.activeRoute.snapshot.params['id'];
    if(this.id){
      this.hideIt = true;
      this.hidePassword = true
      
      this.service.getUserById(this.id).subscribe((data)=>{
       
        this.user = data;
      },error=>{
        this.router.navigate(['/list']);
        this.message.open('Conexão com o servidor perdida','FECHAR',{
          duration:7000
        })
      });
    } else {
      this.user = {
        name: null,
        lastName:null,
        email:null,
        birthday: null,
        password: null,
      } 
    }
  }
  
  
  changePassword():void{
    this.hidePassword = !this.hidePassword;
    if(this.hidePassword && this.hidePassword != undefined)
      this.user.password = undefined;
  }

  createUser():void{
    if(this.user.lastName)
      this.user.lastName = this.user.lastName.trim();
    
    if(this.user.name)  
      this.user.name = this.user.name.trim();

    if(this.user.lastName == '') 
      this.user.lastName = null;

    if(this.user.name == '')
      this.user.name = null;
  
    if(this.user.email && this.user.name && this.user.lastName
        && this.user.password && this.user.birthday){
        this.spinner.show();
        this.service.create(this.user).subscribe((data)=>{
          this.spinner.hide();
          this.message.open('Usuario salvo com sucesso','FECHAR',{
            duration:10000
          });
          this.router.navigate(['/list']);
        },error=>{
          this.spinner.hide();
          if(error.error.message = 'user already existent')
            this.message.open('Este email ja esta em uso','FECHAR',{
              duration:9000
            });        
          if(error.status != 400)
            this.message.open('Servidor indisponível','FECHAR',{
              duration:7000
            });
        });
    } else {
      this.message.open('Por favor insira os valores corretamente no formulario','FECHAR',{
        duration:9000
      });
    }       
  }
  cancel():void{
    this.router.navigate(['/list']);
  }

  updateUser():void{
    if(this.user.lastName)
      this.user.lastName = this.user.lastName.trim();
    
    if(this.user.name)  
      this.user.name = this.user.name.trim();

    if(this.user.lastName == '') 
      this.user.lastName = null;

    if(this.user.name == '')
      this.user.name = null;
    
    if(this.user.name && this.user.lastName && this.user.email &&
      this.user.birthday){
        this.spinner.show();
        this.service.update(this.id,this.user).subscribe(()=>{
          this.spinner.hide();
          this.router.navigate(['/list']);
          this.message.open('Dados atualizados com sucesso','FECHAR',{
            duration:3000
          });
        },error=>{
          
          this.message.open('Erro ao conectar ao servidor','FECHAR',{
            duration:4000
          });
          this.spinner.hide();
        });
      } else {

        this.message.open('Por favor insira os valores corretamente no formulario','FECHAR',{
          duration:9000
        });
      }
  }
}
