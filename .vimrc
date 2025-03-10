"-------------plugin manager--------------------
call plug#begin('~/.vim/plugged')
Plug 'dense-analysis/ale'|                                  "ALE (Asyncronus Linting Engine) - it checks your syntax errors
Plug 'juanDAC/betty-ale-vim'|                               "Integrate Betty linting with ALE
Plug 'cocopon/iceberg.vim'|                                 "A beautiful Iceberg color scheme (theme), because what are we, animals?
call plug#end()
"-------------plugin manager--------------------

let g:ale_c_cc_options = '-std=gnu90 -Wall -Wextra -Werror -pedantic'       "Selecting options for the ALE
" Enable Copilot
let g:copilot_no_tab_map = v:true
imap <silent><script><expr> <C-x> copilot#Accept("\<CR>")

" Optional: Use <C-J> to accept Copilot suggestions
" You can customize this key mapping as needed.

syntax enable                                                               "enable syntax highlighting
set number                                                                  "display the current line

autocmd Filetype c  set noexpandtab shiftwidth=8 softtabstop=8 tabstop=8    "Define tab for c Files
"(no)expandtab = use spaces/tabs
"shiftwidth = level indentation. When you use <enter> how many space do for the next level
"softtabstop = how many spaces do when your press the <tab> key
"tabstop = how many spaces need a \t character
"NOTE - in the 99.99% of the cases you would prefer to set shiftwidth=softtabstop=tabstop
set autoindent   "Sets auto indent
filetype indent on  "Sets auto indent depending on file type
syntax on  "Colorizes the syntax

" Highlight cursor line underneath the cursor horizontally.
set cursorline

" Highlight cursor line underneath the cursor vertically.
" set cursorcolumn

" Enable auto completion menu after pressing TAB.
set wildmenu

" Make wildmenu behave like similar to Bash completion.
set wildmode=list:longest

" There are certain files that we would never want to edit with Vim.
" Wildmenu will ignore files with these extensions.
set wildignore=*.docx,*.jpg,*.png,*.gif,*.pdf,*.pyc,*.exe,*.flv,*.img,*.xlsx


" Map a key to run TrailerTrash
nnoremap <F4> :TrailerTrim<CR>

" Map F3 to select entire buffer and reformat
nnoremap <F3> :%norm! ggVG=<CR>|
" Compile via vim
function! Compile()
    let source_filename = expand('%')
    let number = matchstr(source_filename, '\d\+')
    let test_filename = number . '-main.c'
    let output_filename = substitute(source_filename, '\.c$', '', '')
    let command = 'gcc -Wall -pedantic -Werror -Wextra -std=gnu89 _putchar.c ' . source_filename . ' ' . test_filename . ' -o ' . output_filename
    execute '!'.command
endfunction

command! -nargs=0 Compile :call Compile()

nnoremap <F5> :Compile<CR>

set encoding=utf-8                                "encoding file for unicodes and accents
scriptencoding utf-8                              "Requirements of Vint and it must be after encoding

"Vim's configuration file
"RAW's url: https://git.io/fjppd
"RAW's url2: gustavomejia.tech/.vimrc
"download1: curl -sLo ~/.vimrc https://git.io/fjppd
"reload file :so ~/.vimrc or :so %
"To find more info user :help <option> ex :help [ nocompatible ]
"To exit help use <C-w> q


function! Main()
    try
        call LoadPlugins()
    catch
        call VimPlugInstall()
    endtry
    call Settings()
    call Mappings()
    call SettingFiletypes()
    call SettingPlugins()
endfunction


function! LoadPlugins()
    """use :sort /\//

    call plug#begin('~/.vim/plugged')
    Plug 'rafi/awesome-vim-colorschemes'|           "awesome themes
    Plug 'mattn/emmet-vim'|                         "sippet autocomplete for html/css
    Plug 'neoclide/coc.nvim'
    Plug 'csexton/trailertrash.vim'
    Plug 'rafi/awesome-vim-colorschemes'
    Plug 'ap/vim-css-color'
    Plug 'SirVer/ultisnips'
    Plug 'honza/vim-snippets'
    Plug 'preservim/nerdtree'
    Plug 'jiangmiao/auto-pairs'
    Plug 'tpope/vim-unimpaired'
    Plug 'http://github.com/tpope/vim-surround' " Surrounding ysw)
    Plug 'https://github.com/tpope/vim-commentary' " For Commenting gcc & gc
    Plug 'https://github.com/preservim/nerdtree' ", {'on': 'NERDTreeToggle'}
    Plug 'https://github.com/vim-airline/vim-airline' " Status bar
    Plug 'https://github.com/ryanoasis/vim-devicons' " Developer Icons
    Plug 'https://github.com/preservim/tagbar', {'on': 'TagbarToggle'} " Tagbar for code navigation
    Plug 'https://github.com/junegunn/fzf.vim' " Fuzzy Finder, Needs Silversearcher-ag for :Ag
    Plug 'https://github.com/junegunn/fzf'
    Plug 'https://github.com/navarasu/onedark.nvim'
    Plug 'https://github.com/morhetz/gruvbox'
    Plug 'https://github.com/vim-airline/vim-airline-themes'
    Plug 'https://github.com/mbbill/undotree'
    Plug 'neoclide/coc.nvim', {'branch': 'release'}
    Plug 'https://github.com/lepture/vim-jinja'
    Plug 'https://github.com/tpope/vim-fugitive'
    Plug 'https://github.com/matze/vim-move'
    Plug 'voldikss/vim-floaterm'
    Plug 'vim-python/python-syntax'
    Plug 'alvan/vim-closetag'
    Plug 'hashivim/vim-terraform'|                  "terraform
    Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
    Plug 'junegunn/fzf.vim'
    Plug 'cocopon/iceberg.vim' |                    "iceberg theme
    Plug 'Yggdroot/indentLine'|                     "Create visual space indentation (python, bash, ruby)
    Plug 'neomake/neomake'|                         "neomake for shellchecker
    Plug 'preservim/nerdcommenter'|                 "Create comments in file with <leader>cc
    Plug 'preservim/nerdtree'|                      "File Explorer NERDTree
    Plug 'luochen1990/rainbow'|                     "color brackets
    Plug 'preservim/tagbar'                        "Tagbar menu
    Plug 'SirVer/ultisnips'
    Plug 'vim-airline/vim-airline'|                 "Awesome Status bar
    Plug 'vim-airline/vim-airline-themes'|          "Themes for status bar check https://github.com/vim-airline/vim-airline/wiki/Screenshots
    Plug 'moll/vim-bbye'|                           "requisit for vim-symlink and vimdiff
    Plug 'jeetsukumaran/vim-buffergator'|           "Set BufferTree
    Plug 'ryanoasis/vim-devicons'|                  "Custom Icons; Install Font Patchs before use https://github.com/ryanoasis/nerd-fonts
    Plug 'tpope/vim-fugitive'|                      "git integration
    Plug 'pangloss/vim-javascript'|                 "improve highlighting for javascript
    Plug 'vim-utils/vim-man'
    Plug 'iamcco/markdown-preview.nvim', { 'do': { -> mkdp#util#install() }, 'for': ['markdown', 'vim-plug']}
    "Plug 'matze/vim-move'|                          "move blocks up and down (remaping instead)
    Plug 'roxma/vim-paste-easy'|                    "Enable paste-mode if you paste from clipboard (it checks speed)
    Plug 'honza/vim-snippets'
    Plug 'tpope/vim-surround'|                      "surround
    Plug 'aymericbeaumet/vim-symlink'|              "open source of symbolic links
    Plug 'Vimjas/vint'|                             "Vimscript linter install with pip3 install vim-vint
    Plug 'christoomey/vim-tmux-navigator'|          "set tmux-navigation with vim check the repo for the tmux configuration
    Plug 'bling/vim-bufferline'
    Plug 'christoomey/vim-system-copy'
    if v:version >= 800
        Plug 'JuanDAC/betty-ale-vim'
        Plug 'dense-analysis/ale'|                  "linting program
        Plug 'chrisbra/changesplugin'|              "show changes in git
        Plug 'rust-lang/rust.vim'
        if executable('ctags')
            Plug 'ludovicchabant/vim-gutentags'
        endif
        "Plug 'codota/tabnine-vim'|                  "It needs clangd-9 to works
        "Plug 'mg979/vim-visual-multi'               "Multi cursor
    else
        Plug 'vim-syntastic/syntastic'|             "Ale alternative for vim 700
        Plug 'szw/vim-tags'|                        "create tags :TagsGenerate[!] it needs exuberant-tags package
        if executable('autopep8')
            Plug 'tell-k/vim-autopep8'|             "Edit files acording to pep8
        endif
    endif
    "Plug 'Athesto/vim-betty'|
    call plug#end()
endfunction

function! Settings()
    syntax on                                         "Coloring syntax and highlighting
    filetype indent on                                "enable filetype check for indent
    filetype plugin on                                "enable filetype check for plugin
    "set colorcolumn=80                                "a file should not have more than 80chars
    set cursorline                                    "highlight the line at the cursor
    set exrc                                          "run local .vimrc if it's present
    set hlsearch                                      "highlight search
    set incsearch                                     "increase search and highlight
    set laststatus=2                                  "show file name and save status
    set mouse=a                                       "using mouse, perfect for mobile version
    set modeline                                      "set mode with the first line # :vi set ft=dockerfile:
    set noerrorbells                                  "no sounds
    set nowrap                                        "no wrap line if screen is not enough
    set number                                        "show line number
    set pastetoggle=<F2>                              "disable auto-identing in <C-S-v> with F2
    set path=.,**|                                    "include actual and all child into path. use :find <sub-file>
    "set relativenumber                                "show relative number
    set showcmd                                       "display cmds at bottom right of the screen
    "set splitbelow                                    "split buffers below and not above
    set splitright                                    "split buffers at right
    "set startofline                                  "????
    set t_Co=256                                      "patch, set explicit 256 colors for term w/o 256-color
    set t_u7=""                                       "patch, resolve starting with REPLACE mode on (Windows problem) https://github.com/vim/vim/issues/6365#issuecomment-652299438
    set t_ut=""                                       "patch, resolve whitespace color problem https://github.com/microsoft/terminal/issues/832
    set undodir=~/.vim/undodir                        "Undo directory for undo buffer
    set backupdir=~/.vim/backupdir                    "backupdir
    set backup
    set undofile                                      "save undo buffer in (undodir)ectory
    set wildmenu                                      "expland menu in the statusbar ex: :colorscheme <tab>|
    set tabstop=4                                     "number of space with tab key
    set shiftwidth=4                                  "number of space with autoindenting
    set foldlevelstart=99                             "Folds search about :help usr_28
    "set foldcolumn=1                                 "View the folds
    highlight clear                                   "Clean highlight must go before colorscheme
    try
        "colorscheme challenger_deep                   "Explicit colorscheme
        colorscheme elflord | set background=dark     "Iceberg dark
    catch
        colorscheme evening
    endtry
    call CustomList()
    if v:version >= 800
        call Vim8Setup()
    endif
autocmd VimEnter * NERDTree

    "command -nargs=* Make :make <args> redraw! \|     "redraw make after enter
endfunction

function! CustomList()
    set list                                            "show special chars
    set listchars=|                                     "resetListchars
    set listchars+=tab:├┄                               "i_<C-v> u251c u2504
    set listchars+=tab:›·                               "i_<C-v> u203a u02fd
    set listchars+=tab:│\                               "i_<C-v> u2502 <space>|
    set listchars+=tab:│·                               "i_<C-v> u2502 u02fd
    set listchars+=trail:˽                              "i_<C-v> u02fd
    set listchars+=trail:·                              "i_<C-v> u02fd
    let g:mySKfg=235
    execute 'hi SpecialKey ctermfg ='.g:mySKfg
endfunction

"Airline
let g:airline#extensions#tabline#enabled = 0 " Enable the list of buffers
" ~/full/path-to/file-name.js
let g:airline#extensions#tabline#formatter = 'default'  " f/p/file-name.js
let g:airline#extensions#tabline#formatter = 'jsformatter' " path-to/f
let g:airline#extensions#tabline#formatter = 'unique_tail' " file-name.js
let g:airline#extensions#tabline#formatter = 'unique_tail_improved' " f/p/file-name.js
let g:airline_theme='light'
let g:airline_powerline_fonts = 0
if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif
  " unicode symbols
  let g:airline_symbols_ascii = 1
  let g:airline_left_sep = '▶'
  let g:airline_right_sep = '◀'
  let g:airline_symbols.colnr = ' ℅:'
  let g:airline_symbols.crypt = '🔒'
  let g:airline_symbols.linenr = '☰'
  let g:airline_symbols.linenr = ' ␊:'
  let g:airline_symbols.linenr = ' ␤:'
  let g:airline_symbols.maxlinenr = ''
  let g:airline_symbols.maxlinenr = '㏑'
  let g:airline_symbols.branch = '⎇'
  let g:airline_symbols.paste = 'ρ'
  let g:airline_symbols.paste = 'Þ'
  let g:airline_symbols.paste = '∥'
  let g:airline_symbols.spell = 'Ꞩ'
  let g:airline_symbols.notexists = 'Ɇ'
  let g:airline_symbols.notexists = '∄'
  let g:airline_symbols.whitespace = 'Ξ'

"* enable/disable coc integration >
  let g:airline#extensions#coc#enabled = 1
"<
"* change error symbol: >
  let g:airline#extensions#coc#error_symbol = 'E:'

"* change warning symbol: >
  let g:airline#extensions#coc#warning_symbol = 'W:'

"* enable/disable coc status display >
  let g:airline#extensions#coc#show_coc_status = 1

"* change the error format (%C - error count, %L - line number): >
  let g:airline#extensions#coc#stl_format_err = '%C(L%L)'

"* change the warning format (%C - error count, %L - line number): >
  let g:airline#extensions#coc#stl_format_warn = '%C(L%L)'
"* enable/disable vim-capslock integration >
  let g:airline#extensions#capslock#enabled = 1

"* change vim-capslock symbol >
  let g:airline#extensions#capslock#symbol = 'CAPS'
  "* enable/disable bufferline integration >
  let g:airline#extensions#bufferline#enabled = 0

function! Mappings()
    """ to sort use sort /map /

    " mapping [ insert-mode ]
    let g:mapleader=' '
    inoremap <C-c> <esc>|                               " i_C-c           -> insert MODE mapping Ctrl-c as ESC, VisualBlock problem
    inoremap jk <esc>|                                  " i_jk            -> insert MODE mapping jk as ESC
    inoremap , ,<c-g>u|                                 " i_,             -> create undo mark in key
    inoremap ; ;<c-g>u|                                 " i_;             -> create undo mark in key
    inoremap . .<c-g>u|                                 " i_.             -> create undo mark in key
    inoremap ( (<c-g>u|                                 " i_(             -> create undo mark in key
    inoremap ) )<c-g>u|                                 " i_)             -> create undo mark in key
    inoremap { {}<Esc>ha
    inoremap ( ()<Esc>ha
    inoremap [ []<Esc>ha
    inoremap " ""<Esc>ha
    inoremap ' ''<Esc>ha
    inoremap ` ``<Esc>ha
    nmap <leader>t :TagbarToggle<CR>
    " mapping [ normal-mode ]\
    nnoremap * *N|                                      " n_*             -> don't change position with *\
    nnoremap <C-@> <C-^>zz|                             " n_C-<space>     -> go to last open file
    nnoremap <C-H> <C-W><C-H>|                          " n_C-H           -> change windows (left)
    nnoremap <C-J> <C-W><C-J>|                          " n_C-J           -> change windows (down)
    nnoremap <C-K> <C-W><C-K>|                          " n_C-K           -> change windows (up)
    nnoremap <C-L> <C-W><C-L>|                          " n_C-L           -> change windows (right)
    nnoremap <C-W>b :sba<CR>                            " n_C-w-b         -> window from buffer
    nnoremap <C-W>vb :vert sba<CR>                      " n_C-w-v-b       -> vertical window from buffer
    nnoremap <C-T>b :tab ba<CR>                         " n_C-t-b         -> tab from buffer
    nnoremap <C-T>o :tabonly<CR>                        " n_C-t-o         -> only one tab
    nnoremap <F3> :set wrap!<CR>:set wrap?<CR>|         " n_<F3>          -> toggle wrap
    nnoremap <F4> :set nu! list!<CR>|                   " n_<F4>          -> toggle numbers
    nnoremap <esc>h :tabprevious<CR>|                   " n_M-h           -> goto previous tab (more confortable)
    nnoremap <esc>l :tabnext<CR>|                       " n_M-l           -> goto next tab (more confortable)
    nnoremap <leader><esc> :nohl<CR>|                   " n_<leader><esc> -> clean format
    nnoremap <leader>U magUiw`a|                        " n_<leader>U     -> uppecase word
    nnoremap <leader><leader>w :call WriteForced()<CR>| " n_<leader><leader>w -> sudo save
    nnoremap <leader>a ggVG|                            " n_<leader>U     -> select all document
    nnoremap <leader>b :BuffergatorToggle<CR>|          " n_<leader>b     -> Toggle BufferTree
    "nnoremap <leader>b :Buffers<CR>|                   " n_<leader>b     -> fzf buffer finder
    nnoremap <leader>e :NERDTreeToggle<CR>|             " n_<leader>e     -> toggle FileExplorer (NERDTree)
    nnoremap <leader>ff :Files<CR>|                     " n_<leader>f     -> using fzf as file finder
    nnoremap <leader>fb :Buffers<CR>|                     " n_<leader>f     -> using fzf as file finder
    nnoremap <leader>f.. :FZF ..<CR>|                   " n_<leader>f     -> using fzf as file finder
    nnoremap <leader>ft :call FZFGitTopLevel()<CR>|     " n_<leader>ft    -> using fzf to repo top level
    nnoremap <leader>fh :FZF ~<CR>|                     " n_<leader>f     -> using fzf as file finder
    nnoremap <leader>i magg=G'a|                        " n_<leader>i     -> indent file
    " nnoremap <leader>q :q<CR>|                          " n_<leader>q     -> quit
    nnoremap <leader>q :call Bye()<CR>|                 " n_<leader>q     -> (buffers > 1) ? buffer delete : quit
    nnoremap <leader>r :e<CR>|                          " n_<leader>r     -> reload file
    nnoremap <leader>u maguiw`a|                        " n_<leader>u     -> lowercase word
    nnoremap <leader>w :w<CR>|                          " n_<leader>w     -> save
    nnoremap <leader>xe :call EditVIMRC()<CR>|          " n_<leader>xe    -> edit VIMRC
    nnoremap <leader>j :call CurlLocal()<CR>|           " n_<leader>j     -> curl into localhost
    nnoremap G Gzz|                                     " n_G             -> center windows after search end
    nnoremap H :bprevious<CR>zz|                        " n_Meta-h        -> goto previous buffer (more confortable)
    nnoremap L :bnext<CR>zz|                            " n_Meta-l        -> goto next buffer (more confortable)
    nnoremap gp `[v`]|                                  " n_gp            -> select pasted text
    "nnoremap R <Esc>|                                   " n_R            -> patch, Disable ReplaceMode (Fix Windows OS Problems)
    nnoremap [b :bprevious<CR>|                         " n_[-b           -> goto previous buffer
    nnoremap [e :ALEPrevious<CR>|                       " n_[-K           -> goto previous ALE_Error
    nnoremap [t :tabprevious<CR>|                       " n_[-K           -> goto previous tab
    nnoremap ]b :bnext<CR>|                             " n_]-K           -> goto next buffer
    nnoremap ]e :ALENext<CR>|                           " n_]-K           -> goto next ALE Error
    nnoremap ]t :tabnext<CR>|                           " n_]-K           -> goto next tab
    "nnoremap g<F1> :help <C-R><C-F><CR>|               " n_g<F1>        -> use insted K on the word open help for word under the cursor Ex. use g<F1> -> cmdline
    "nnoremap q: <nop>|                                 " n_q:           -> disable history windows (it gives me conficts)
    nnoremap <esc>j :move +1<CR>==|                     " n_Meta-j        -> move line below and format line
    nnoremap <esc>k :move -2<CR>==|                     " n_Meta-k        -> move line above and format line
    nnoremap <C-f> :NERDTreeFocus<CR>

    " mapping  [ cmdline-mode ]
    cnoremap <C-A> <Home>|                              " c_Ctrl-A    -> go to Beginning of line
    cnoremap <C-B> <Left>|                              " c_Ctrl-b    -> backward a char
    cnoremap <C-F> <Right>|                             " c_Ctrl-f    -> fordward a char
    cnoremap <C-d> <Right><BS>|                         " c_Ctrl-d    -> delete char forward
    cnoremap <esc><BS> <C-W>|                           " c_Meta-DEL  -> delete word backward
    cnoremap <esc>b <S-Left>|                           " c_Meta-b    -> backward a word
    cnoremap <esc>d <S-Right><Right><C-W>|              " c_Meta-d    -> delete word forward
    cnoremap <esc>f <S-Right>|                          " c_Meta-f    -> fordward a word

    " mapping [ visual-mode ]
    vnoremap <leader>y :call YankToXclip()<CR>|         " v_<leader>y -> yank selection to clipboard with xclip
    vnoremap <esc>j :move '>+1<CR>gv=gv|                " v_Meta-j    -> move selection below, reselect, format and reselect
    vnoremap <esc>k :move '<-2<CR>gv=gv|                " v_Meta-k    -> move selection above, reselect, format and reselect
endfunction

function! SettingFiletypes()
    augroup Filetypes
        autocmd!
        autocmd BufNewFile,BufRead *.asm        set filetype=nasm
        autocmd BufNewFile,BufRead *.sh         set filetype=bash
        autocmd BufNewFile,BufRead *.cfg        set filetype=conf
        autocmd BufNewFile,BufRead *.h          set filetype=c
        autocmd BufNewFile,BufRead *.pp         set filetype=puppet
        autocmd BufNewFile,BufRead man_[1-9]_*  set filetype=nroff
        autocmd Filetype sh                     set expandtab sw=4 ts=4 sts=4
        autocmd Filetype sql                    set expandtab sw=2 ts=2 sts=2
        autocmd Filetype sshconfig              set expandtab sw=4 ts=4 sts=4
        autocmd Filetype json                   set expandtab sw=2 ts=2 sts=2
        autocmd Filetype c                      set noexpandtab sw=4 ts=4 sts=4 keywordprg=:Man "explicit, I had problem with nasm and c
        autocmd Filetype nasm                   set expandtab sw=8 ts=8 sts=8
        autocmd Filetype conf                   set expandtab
        autocmd Filetype html                   set expandtab sw=2 ts=2 sts=2
        autocmd Filetype htmldjango             set expandtab sw=4 ts=4 sts=4
        autocmd Filetype javascript             set expandtab sw=2 ts=2 sts=2
        autocmd Filetype yaml                   set expandtab sw=4 ts=4 sts=4
        autocmd Filetype python                 set expandtab sw=4 ts=4 sts=4 fdm=indent
        autocmd Filetype puppet                 set expandtab sw=4 ts=4 sts=4
        autocmd Filetype ruby                   set expandtab sw=4 ts=4 sts=4
        autocmd Filetype python                 set expandtab sw=4 ts=4 sts=4 keywordprg=:!python3\ -m\ pydoc
        autocmd Filetype vim                    set expandtab sw=4 ts=4 sts=4

        let g:html_indent_inctags = ''                      "autointent new line after enter
        let g:html_indent_autotags = 'p,html'               "no autoindent with format
        autocmd Filetype htmldjango RainbowToggle
        autocmd Filetype htmldjango EmmetInstall

        augroup highlight_over80
            autocmd!
            autocmd Filetype * highlight OverLength ctermbg=167 ctermfg=234 guibg=#592929
            autocmd Filetype * match OverLength //|                                 "patch, 1. edit py, 2. edit another file
            autocmd Filetype c,python match OverLength /\%80v./
            autocmd Filetype javascript match OverLength /\s\+$/
        augroup END

        augroup auto_format_nasm
            autocmd BufWritePost *.asm call Nasmfmt()
        augroup END

        augroup Remove_trailing_whitespaces
            autocmd BufWritePre *.py,*.c,*.h %s/\s\+$//e
        augroup END

        augroup mysql
            autocmd!
            "autocmd BufWritePre *.sql
        augroup END
    augroup END
endfunction

function! SettingPlugins()
    augroup Plugins_Filetypes
        autocmd!
        autocmd FileType html,css EmmetInstall                                   "only use in css and html
        autocmd FileType nerdtree RainbowToggleOff                               "Disable Rainbow brackets in NERDTree
        autocmd Filetype c,sh let g:NERDSpaceDelims = 2                             "NerdCommenter spaces 1
        autocmd Filetype fugitive
                    \ nnoremap <buffer> <leader>?
                    \ :below vertical help fugitive-maps<cr> |                   "remap g? right split the help messages
    augroup END

    nnoremap <F2> :noh<CR>
    let g:bullets_enabled_file_types = [
                \ 'markdown',
                \ 'text'
                \]
    let g:floaterm_keymap_new    = '<F7>'
    let g:floaterm_keymap_prev   = '<F8>'
    let g:floaterm_keymap_next   = '<F9>'
    let g:floaterm_keymap_toggle = '<F12>'
    nnoremap <F5> :w<CR>:FloatermNew --autoclose=0 python3 %<CR>

    " Tagbar

    nmap <F6> :TagbarToggle<CR>

    inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm() : "\<CR>"
    inoremap <expr> <Tab> pumvisible() ? "\<C-N>" : "\<Tab>"
    inoremap <expr> <S-Tab> pumvisible() ? "\<C-P>" : "\<C-H>"

    let g:ale_fixers = {
                \'rust': ['rustfmt'],
                \'python' : ['autopep8'],
                \'html' : ['prettier'],
                \'javascript': ['standard']}
    let g:ale_linters = {
                \'rust': ['rustc', 'rls', 'cargo'],
                \'python' : ['flake8'],
                \'c':['betty-style', 'betty-doc','gcc'],
                \'javascript': ['eslint']}
    let g:ale_c_cc_options = '-std=gnu90 -Wall -Wextra -Werror -pedantic'        "c options
    let g:ale_nasm_nasm_options = '-f elf64'
    let g:ale_fix_on_save = 1                                                    "fixautopep after save file
    let g:ale_javascript_standard_executable = 'semistandard'                    "set semistandard executable as standard
    let g:ale_javascript_standard_options = '--global $'                         "disable jquery warning
    let g:ale_javascript_standard_use_global = 1
    let g:ale_python_pycodestyle_executable = 'pep8'
    let g:ale_python_flake8_use_global = 1
    let g:ale_python_flake8_options = '--ignore=E241,E501'                            "501(80chars)
    let g:ale_python_flake8_options = '--ignore=E241,E402,E501'
    let g:ale_set_highlights = 1 " Disable highligting
    set omnifunc=ale#completion#OmniFunc

    let g:NERDCustomDelimiters = { 'nroff': { 'left': '.\\"'} }                  "NERDCommenter has problems with backslash
    let g:NERDTreeDirArrowExpandable="+"
    let g:NERDTreeDirArrowCollapsible="~"
    let g:python_highlight_all = 1
    let g:NERDDefaultAlign = 'left'
    let g:autopep8_disable_show_diff=1                                           "disable diff
    let g:autopep8_on_save = 1                                                   "Run autopep8 everytime that save
    let g:buffergator_suppress_keymaps = 1                                       "Let me set <leader>b as BuffergatorToggle
    let g:changes_vcs_check = 1                                                  "enable git check
    let g:gutentags_ctags_tagfile = '.git/tags'                                  "set tags into the .git directory
    let g:indentLine_char = '│'                                                  "using for indentation i_<C-v> u203a u02fd
    let g:indentLine_color_term = g:mySKfg                                         "set color as the colorscheme
    let g:neomake_shellcheck_args = ['-fgcc']                                    "[deprecated] fix ERROR with neomake and shellcheck
    let g:rainbow_active = 1                                                     "set to 0 if you want to enable it later via :RainbowToggle
    let g:user_emmet_install_global = 0                                          "disable emmet globally
    let g:user_emmet_leader_key = '<Tab>'                                        "autocomplete with tab


    let g:syntastic_c_compiler_options =
                \'-std=gnu90 -Wall -Wextra -Werror -pedantic'

    let g:NERDTreeNaturalSort = 1                                                "NerdTree sort 1, 2, 3, 100, 1000
    augroup myBufenter
        autocmd!
        "autocmd bufwinenter * silent NERDTreeMirror                                  "Open the existing NERDTree on each new tab.
        autocmd bufenter * if (winnr("$") == 1 &&
                    \exists("b:NERDTree") &&
                    \b:NERDTree.isTabTree()) | q | endif                         "close all if there is only one window
    augroup END

endfunction

function! Vim8Setup()
    " mapping [ normal-mode ]
    nnoremap <C-W>% <C-W>:below vertical terminal<CR>
    nnoremap <C-W>" <C-W>:below terminal<CR>

    " mapping [ terminal-mode ]
    tnoremap <C-W>% <C-W>:below vertical terminal<CR>
    tnoremap <C-W>" <C-W>:below terminal<CR>
    packadd termdebug                              "use Terminal Plugin

    "call VimIDE()
    let g:termdebug_popup = 100
    let g:termdebug_wide = 163                     "split windows Vertically
endfunction


""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"--------------------------------------------------------MY FUNCTIONS--------------------------------------------------------"
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
function! VimIDE()
    set termwinsize=12x0

    tnoremap <C-H> <C-W><C-H>|                        " n_C-H       -> change windows in terminal mode (left)
    tnoremap <C-J> <C-W><C-J>|                        " n_C-J       -> change windows in terminal mode (down)
    tnoremap <C-K> <C-W><C-K>|                        " n_C-K       -> change windows in terminal mode (up)
    "tnoremap <C-L> <C-W><C-L>|                        " n_C-L       -> change windows (right)

    augroup VimIDE
        autocmd VimEnter * NERDTree
        autocmd VimEnter * wincmd p
        below terminal
    augroup END
endfunction

function! WriteForced()
    execute ':silent w !sudo tee % > /dev/null'
    edit!
endfunction

function! EditVIMRC()
    execute ':silent tabedit $MYVIMRC'
    echom '.vimrc'
endfunction

function! IsWSL()
    if !has('linux')
        return 0
    elseif !exists('/proc/version')
        return 0
    endif

    let lines = readfile('/proc/version')
    if !lines[0] =~? 'microsoft'
        return 0
    endif

    return 1
endfunction

function! YankToXclip()
    execute ':normal! gv"yy'
    if IsWSL()
        call system('clip.exe', @y)
    elseif has('osx')
        call system('pbcopy', @y)
    else
        call system('xclip -selection clipboard', @y)
    endif

    if exists('$TMUX')
        call system('tmux load-buffer -', @y)
    endif
endfunction

function! ClearRegisters()
    let regs=split('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-"', '\zs')
    for r in regs
        call setreg(r, [])
    endfor
endfunction

function! Bye()
    if len(filter(range(1, bufnr('$')), 'buflisted(v:val)')) == 1
        :q
    else
        :bdelete
    endif
endfunction

function! Nasmfmt()
    """ Format the nasm file with the binary nasmfmt, repo -> https://github.com/yamnikov-oleg/nasmfmt
    if executable('nasmfmt')
        execute ':silent !nasmfmt -ci 35 %'
        edit!   "don't need L<CR> for reload
        redraw! "it's necesary you call the function manually
    endif
endfunction

function! Foobar()
    echom 'testing function'
endfunction

function! CurlLocal()
    execute 'silent !curl -s "http://localhost:5000/api/v0/global_costs?start=2022-05-02&end=2022-05-09&format=html&responsible=Colombia" &>/tmp/index.html &'
    redraw!
endfunction

function! FormatSQL()
    execute ':echom "jaja"'
    execute ':s/select /SELECT\r\t/g'
    execute ':%s/\(select\|\order\|by\|from\|where\|show\|grant\)/\U\1/ge'
endfunction

function! FZFGitTopLevel()
    let toplevel = system('git rev-parse --show-toplevel')[:-2]  " remove new line
    execute 'FZF ' . toplevel
endfunction

function! VimPlugInstall()
    silent !mkdir -p $HOME/.vim/undodir
    silent !mkdir -p $HOME/.vim/backupdir

    if !executable('git')
        echohl WarningMsg | echomsg 'Warning: Vim-plug needs git to install the plugins' | echohl None
        return
    endif

    if !executable('curl')
        echohl WarningMsg | echomsg 'Warning: Vim-plug needs curl for the installation' | echohl None
        return
    endif

    if !exists('*plug#begin')
        silent !echo -e "\033[0m\033[31m\nOh no\!, Vim-plug manager is not found, Don't worry, I will install it\033[0m"
        !curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
        call Main()
        PlugInstall
        quit
    endif
endfunction

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
"--------------------------------------------------------ENTRY POINT---------------------------------------------------------"
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

call Main()
set wildignore=*.docx,*.jpg,*.png,*.gif,*.pdf,*.pyc,*.exe,*.flv,*.img,*.xlsx


" Map F2 to auto check code betty style or pycodestyle or shellcheck
function! CheckCode()
    let filetype = &filetype
    let filename = expand('%:t')
    if filetype ==# 'c' || filename =~# '\.h$'
        execute '!betty %'
    elseif filetype ==# 'python'
        execute '!pycodestyle %'
    elseif filetype ==# 'sh'
        execute '!shellcheck %'
    endif
endfunction
nnoremap <F2> :call CheckCode()<CR>

" Map a key to run TrailerTrash
nnoremap <F4> :TrailerTrim<CR>

" Map F3 to select entire buffer and reformat
function! Indent()
    let save_cursor = getpos(".")
    execute "normal! ggVG="
    call setpos('.', save_cursor)
endfunction

nnoremap <F3> :call Indent()<CR>
" Compile via vim
function! Compile()
    let source_filename = expand('%')
    let number = matchstr(source_filename, '\d\+')
    let test_filename = number . '-main.c'
    let output_filename = substitute(source_filename, '\.c$', '', '')
    let command = 'gcc -Wall -pedantic -Werror -Wextra -std=gnu89 _putchar.c ' . source_filename . ' ' . test_filename . ' -o ' . output_filename
    execute '!'.command
endfunction

command! -nargs=0 Compile :call Compile()

nnoremap <F5> :Compile<CR>
