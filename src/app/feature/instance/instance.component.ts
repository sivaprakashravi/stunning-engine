import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-instance',
  templateUrl: './instance.component.html',
  styleUrls: ['./instance.component.scss']
})
export class InstanceComponent implements OnInit {
  barcode = "";
  target = "";
  isLoggedIn = false;
  since = null;
  contactList: any[] = [];
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    const self = this;
    self.contactList = [];
    self.pushNewContact();
    self.httpClient.get('http://localhost:3000/login').subscribe((res: any) => {
      self.barcode = res.barcode;
      self.target = res.target;
      window.setTimeout(() => {
        self.checkLogin();
      }, 5000);
    });
  }

  pushNewContact() {
    const list = this.contactList;
    list.push({
      name: "",
      number: ""
    });
    this.contactList = list;
  }

  async checkLogin() {
    if (this.target) {
      this.httpClient.get(`http://localhost:3000/verify/${this.target}`).subscribe((res: any) => {
        this.isLoggedIn = res.isConnected;
        this.since = res.since;
      });
    }
  }

  async message() {
    const contacts = this.contactList.map(c => c.number);
    if (this.target && contacts && contacts.length) {
      const content = {
        message: "Hi",
        contacts
      };
      this.httpClient.post(`http://localhost:3000/message/${this.target}`, content).subscribe((res: any) => {
        console.log(res);
      });
    }
  }

  async logout() {
    if (this.target) {
      this.httpClient.get(`http://localhost:3000/logout/${this.target}`).subscribe((res: any) => {
        this.barcode = "";
        this.target = "";
        this.isLoggedIn = false;
      });
    }
  }

  uploadFile(event: any) {
    const files = event?.target.files;
    if (files && files.length > 0) {
      let file: any = files.item(0);
      let reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        const contacts: any[] = [];
        let csv: string = reader.result as string;
        csv = csv.replace(/[\r]+/gm, '');
        const splitted = csv.split('\n');
        splitted.map(s => {
          const row = s.split(":");
          contacts.push({
            name: row[0].trim(),
            number: row[1].trim(),
            file: true
          });
        });
        this.contactList = this.contactList.concat(contacts);
      }
    }
  }

}
