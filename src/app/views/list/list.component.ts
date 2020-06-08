import emailMask from 'text-mask-addons/dist/emailMask';
import { DialogBoxComponent } from './../../components/templates/dialog-box/dialog-box.component';
import { User } from './../../../assets/Interfaces/User';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from './../../components/service.service';
import { Filter } from './../../../assets/Interfaces/Filter';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  filter:Filter = {
    name:'',
    birthday:'',
    email:''
  }
  list: User[];
  reload:boolean = true;
  emailMask = emailMask;
  maxDate = new Date();
  hideTip:boolean = true;

  constructor(private service:ServiceService, private router: Router, 
    private message:MatSnackBar,private spinner:NgxSpinnerService,private dialog:MatDialog) { }


  ngOnInit(): void {
    this.getList()
  }

  hiddenAll:boolean = false
  getList(){ 
    this.spinner.show()
    if(this.filter.name)
      this.filter.name = this.filter.name.trim();
    if(this.filter.email)
      this.filter.email = this.filter.email.trim();
 

    this.service.getUsers(this.filter).subscribe((data)=>{
      for (let user of data) {
        user.birthday = moment(user.birthday).format('DD-MM-YYYY');
        user.createdAt = moment(user.createdAt).format('DD-MM-YYYY');
        user.hidden = false;
      } 
      this.list = data;
      this.reload = true; 

      if(this.filter.birthday)
        this.filter.birthday = '';

      if(this.filter.name)
        this.filter.name= '';

      if(this.filter.email)
        this.filter.email = '';

      this.spinner.hide();
      this.message.open('Busca completa','FECHAR',{
        duration:1000
      });

      this.hiddenAll = false;

      if(this.list.length == 0){
        this.hideTip = false;
      } else {
        this.hideTip = true;
      }
    },error=>{
      this.spinner.hide()
      this.hiddenAll = true;
      if(error.status != 400){
        this.reload = false;
        this.message.open('Servidor indisponível','FECHAR',{
          duration:7000
        });
      }
    })
  }

  reloadPage(){
    window.location.reload();
  }

  goToUpdate(user:User){
      this.router.navigate(['/user/update/'],)
  }

  delete(user:User){
    let dailogRef = this.dialog.open(DialogBoxComponent);

    dailogRef.afterClosed().subscribe(result=>{
        this.spinner.show();
        this.service.validate(user._id,result).subscribe((validation)=>{
          
          if(validation.allow){
            this.service.deleteUser(user._id).subscribe(()=>{
              user.hidden = true;
              this.spinner.hide(); 
              this.message.open(`${user.name} ${user.lastName} deletado com sucesso`,'FECHAR',{
                duration:6000
              })
            },error=>{
              this.spinner.hide();
              if(error != 400)
                this.message.open('Erro ao enviar ao servidor, por favor tente mais tarde','FECHAR',{
                  duration:15000
                });
            });
          } else {
            this.spinner.hide()
            this.message.open('Senha incorreta','FECHAR',{
              duration:4000
            })
          }
        },error=>{
          this.spinner.hide()
          console.log(error);
          
          if(error.status == 0){
            this.message.open('Erro ao enviar ao servidor, por favor tente mais tarde','FECHAR',{
              duration:15000
            });
          } else {
            this.message.open('Por favor insira a senha','FECHAR',{
              duration:6500
            });
          }
        });
        
    });  
  }

}
