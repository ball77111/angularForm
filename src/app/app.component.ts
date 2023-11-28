import { Component,OnInit } from '@angular/core';
import { MembersService, MemberType } from './service/members.service';
import { UntypedFormBuilder, UntypedFormGroup,FormArray} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angularForm';

  constructor(
    private membersService: MembersService,
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    ) { }

    validatorForm!: UntypedFormGroup;
    members: MemberType[] = [];
    btnSwitch:boolean = false

    get formArray(): FormArray {
      return (this.validatorForm.get('Data') as FormArray);
    }

    getButtonStyle() {
      return this.btnSwitch ? {'cursor': 'pointer'} : {'cursor': 'not-allowed'};
    }


    ngOnInit(): void {
      this.validatorForm = this.fb.group({
        Data: this.fb.array([])
      });
    }

    //取得成員資料
    getMember() {
      this.btnSwitch = true;
      this.membersService.getMember().then(res => {
        this.members = res
        this.formArray.clear();
        for (const member of this.members) {
          this.formArray.push(this.createItem(member));
        }
      })
    }

    // 新增
    createItem(data?: MemberType): UntypedFormGroup {
      return this.fb.group({
        Name: [data?.Name || ''],
        DateOfBirth: [this.formatDate(data?.DateOfBirth)],
        Salary: [data?.Salary || 0],
        Address: [data?.Address || ''],
      });
    }

    // 刪除
    deleteItem(idx: number) {
      if(this.formArray.length <=1){
        alert('只剩一筆不能刪除')
        return
      }
      this.formArray.removeAt(idx);
    }

    formatDate(dateString: string | undefined): string {
      if (dateString) {
        const date = new Date(dateString);
        return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
      }
      return '';
    }

    addList() {
      if(this.validatorForm.get('Data')?.value.length >=10){
        alert('我們單位只有10位')
        return
      }
      this.formArray.push(this.createItem());
    }

    save(){
      this.membersService.editMember(this.validatorForm.get('Data')?.value)
        .then((res) => {
          alert('更新成功');
          this.getMember();
        })
        .catch((err) => {
          console.error(err);
          alert('更新失敗');
        });
    }

}
