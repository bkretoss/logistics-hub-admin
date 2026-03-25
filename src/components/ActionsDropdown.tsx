import { ChevronDown, Columns3, Filter, Database, Palette, BarChart2, Rows3,
  BookOpen, Download, Mail, HelpCircle, TableProperties, ArrowUpDown, Sigma,
  Calculator, History, SplitSquareVertical, Highlighter, LayoutList,
  FileText, FileBarChart, FilePieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';

interface ActionsDropdownProps {
  onFilter?: () => void;
  onRowsPerPage?: (n: number) => void;
  currentPageSize?: number;
  size?: 'sm' | 'default';
}

const ActionsDropdown = ({ onFilter, onRowsPerPage, currentPageSize, size = 'default' }: ActionsDropdownProps) => {
  const isSmall = size === 'sm';
  const iconCls = isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const itemCls = isSmall ? 'gap-2 text-xs' : 'gap-2';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={isSmall ? 'gap-1.5 px-3 h-[30px] text-xs rounded' : 'gap-2 px-4 h-[38px] rounded-lg'}
        >
          Actions <ChevronDown className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem className={itemCls}><Columns3 className={iconCls} /> Columns</DropdownMenuItem>
        <DropdownMenuItem className={itemCls} onClick={onFilter}><Filter className={iconCls} /> Filter</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={itemCls}><Database className={iconCls} /> Data</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem className={itemCls}><ArrowUpDown className={iconCls} /> Sort</DropdownMenuItem>
            <DropdownMenuItem className={itemCls}><Sigma className={iconCls} /> Aggregate</DropdownMenuItem>
            <DropdownMenuItem className={itemCls}><Calculator className={iconCls} /> Compute</DropdownMenuItem>
            <DropdownMenuItem className={itemCls}><History className={iconCls} /> Flashback</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={itemCls}><Palette className={iconCls} /> Format</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem className={itemCls}><SplitSquareVertical className={iconCls} /> Control Break</DropdownMenuItem>
            <DropdownMenuItem className={itemCls}><Highlighter className={iconCls} /> Highlight</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={itemCls}><LayoutList className={iconCls} /> Rows Per Page</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {[1, 5, 10, 15, 20, 25, 50, 100, 1000].map(n => (
                  <DropdownMenuItem key={n} className={`${itemCls} justify-between`}
                    onClick={() => onRowsPerPage?.(n)}>
                    {n}
                    {currentPageSize === n && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className={`${itemCls} justify-between`}
                  onClick={() => onRowsPerPage?.(0)}>
                  All
                  {currentPageSize === 0 && <span className="w-2 h-2 rounded-full bg-primary" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem className={itemCls}><BarChart2 className={iconCls} /> Chart</DropdownMenuItem>
        <DropdownMenuItem className={itemCls}><Rows3 className={iconCls} /> Group By</DropdownMenuItem>
        <DropdownMenuItem className={itemCls}><TableProperties className={iconCls} /> Pivot</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className={itemCls}><BookOpen className={iconCls} /> Report</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem className={itemCls}><FileText className={iconCls} /> Summary</DropdownMenuItem>
            <DropdownMenuItem className={itemCls}><FileBarChart className={iconCls} /> Detailed</DropdownMenuItem>
            <DropdownMenuItem className={itemCls}><FilePieChart className={iconCls} /> Analytics</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem className={itemCls}><Download className={iconCls} /> Download</DropdownMenuItem>
        <DropdownMenuItem className={itemCls}><Mail className={iconCls} /> Subscription</DropdownMenuItem>
        <DropdownMenuItem className={itemCls}><HelpCircle className={iconCls} /> Help</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsDropdown;
