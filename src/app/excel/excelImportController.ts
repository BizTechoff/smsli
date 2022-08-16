
import { Remult } from 'remult';
import { BackendMethod } from 'remult/src/server-action';
import * as xlsx from 'xlsx'; //https://sheetjs.com/
import { GroupMobile } from '../core/group-mobile';
import { Group } from '../core/group/group';
import { Mobile } from '../core/mobile/mobile';

export class ExcelImportController {
    @BackendMethod({ allowed: true })
    static async importMobilesFromExcel(dataArray: any, remult?: Remult) {
        const MOBILE_NUMBER = "C"
        const MOBILE_FIRST_NAME = "A"
        const MOBILE_LAST_NAME = "B"
        const MOBILE_GROUP_NAME = "D"
        console.log('importMobilesFromExcel.dataArray', JSON.stringify(dataArray))
        const mobileRepo = remult!.repo(Mobile);
        let i = 0;
        let allg = await remult!.repo(Group).find()
        for (const row of dataArray) {

            let mobile = row[xlsx.utils.decode_col(MOBILE_NUMBER)] + ''
            if (!mobile && !mobile.trim().length) {
                continue
            }
            console.log('mobile', mobile.length, JSON.stringify(mobile))
            let temp = ''
            let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            for (const c of mobile) {
                if (digits.includes(c)) {
                    temp += c
                }
            }
            if (!temp.length) {
                continue
            }
            if (temp.length < 10) {
                temp = temp.padStart(10, '0')
            }
            mobile = temp
            ++i;
            // if (i === 1) {//header
            //     continue
            // }
            //find existing product by name
            let m = await mobileRepo.findFirst({ number: mobile }, { createIfNotFound: true });
            m.fname = row[xlsx.utils.decode_col(MOBILE_FIRST_NAME)] + ''
            m.lname = row[xlsx.utils.decode_col(MOBILE_LAST_NAME)] + ''
            let g = row[xlsx.utils.decode_col(MOBILE_GROUP_NAME)] + ''

            let found = allg.find(grp => grp.name === g)
            //     {
            //     grp.name === g
            //     console.log('grp.name', grp.name, 'g', g, grp.name === g)
            // })
            console.log('found', found)
            if (found) {
                let gs!: GroupMobile
                if (!m.isNew()) {
                    console.log('m.isNew()', m.isNew())
                    gs = await remult!.repo(GroupMobile).findFirst({ group: { $id: found.id }, mobile: { $id: m.id } }, { createIfNotFound: true })
                    if (gs.isNew()) {
                        await gs.save()
                    }
                }
            }

            await m.save();
        }
        return i;
    }
}
