import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from "rxjs/operators";

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  ngOnDestroy(): void {
    //terminamos el observable
    this.intervalSubs.unsubscribe();
  }

  constructor() {
   
    // this.retornaObservable().pipe(
    //   retry(1)//lo intenta 1 vez
    // ).subscribe(
    //   valor => console.log("subs: ", valor),
    //   error => console.log("error", error),
    //   () => console.log("obs terminado")

    // );

    this.intervalSubs = this.retornaIntervalo().subscribe((valor)=>{
      console.log(valor);
    })
  }


  retornaIntervalo(): Observable<number>{
    return interval(100).pipe(
      //take(10),
      map(valor =>{
        return valor+1;
      }),
      filter( valor => (valor % 2 ===0)? true : false),
    )
    
  }

  retornaObservable(): Observable<number>{
    let i=0;
    return new Observable<number>( observer =>{
      const intervalo = setInterval(() =>{
        //console.log("tik");
        i++;
        observer.next(i);//para emitir el valor del observable

        if(i===4){
          clearInterval(intervalo);
          observer.complete(); //termina el observable
        }

        if(i===2){
          observer.error("i llego al valor de 2");//devuelve el error en el observable
        }
      }, 1000)
    });
  }

}
